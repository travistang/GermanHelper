import {setSearchResults,setIsSearching} from '../actions'
import cio from 'cheerio-without-node-native';

/*
  Scraping pipeline:
    1. search list of possible words in wiktionary
    for each result:
      2. fetch the corresponding wiktionary page
      3. check if the word is german
      if the word is not, discard it. Otherwise...
      4. get all type of the words
      if the word is not a verb...
        5a. retrieve all meanings from the wiktionary page
      else:
        5b. Visit the corresponding page in LEO
        6. Take the table for verb
        for each row of the verb table...
          7. grab the meaning as well as the german annotation (e.g. etw.dat.warten)
          8. transform them to an object like:
              {
                meaning: ...,
                preposition: ...,
                [reflexive: true],
                nounForm: acc/dat
              }
      9. retrieve the grammatical details of each word
*/
const urlToDOM = (url) => {
  return fetch(url)
    .then(result => result.text())
    .then(text => cio.load(text))
}
const supportedWordType = 'Noun,Verb,Adjective,Adverb'.split(',')
const dropTerms = 'jmd,jmdn,jmdm,etw,jmdn/etw,jmdm/etw'.split(',')
const prepositions = 'nach,um,seit,zu,vor,auf,aus,mit,bis'.split(',')
const verbForms = 'acc,dat,gen,nom'.split(',')
//5b.
const getVerbMeaning = (word) => {

  let url = `https://dict.leo.org/german-english/${word}`
  return urlToDOM(url)
    .then($ => {
      let getVerbUsage = (terms) => {
        if(terms.length == 1) return null // just a normal verb
        // TODO: join the terms to form a single sentence
        return terms.filter(term => {
          return dropTerms.indexOf(term) == -1
        })
        .map(term => (verbForms.indexOf(term)!= -1)?`(${term}.)`:term)
        .join(' ')
      }
      let sectionSelector = 'div.section[data-dz-name]'
      let formExplanations = $(sectionSelector)
        .filter(function(i,el) {
          let type = $(this).find('thead > tr > th >  h2').text()
          return type == 'Verbs'
        })
        .first() // is a verb table now
        .find('tr.is-clickable') // get all the rows of the verb table
        .map(function(i,e) { // parse the row to an object with {german: meaning}
          let meaning = $(this).find('> td:nth-child(5)')
            .text()
            .replace(/\|.*\|/g,'') // remove something like |...|
            .replace(/\(.*\)/g,'') // remove something like (...)
            .replace(/\[.*\]/g,'') // remove something like [...]
            .replace(/ +(?= )/g,'') // remove multiple spacing
            .replace(/-.*$/,'')     //remove something like -...
            .trim() // purify string
          let germanForm = $(this).find('> td:nth-child(8)')
            .text()
            .replace('sichdat','sich dat')
            .replace('sichacc','sich acc')
            .replace(/\|.*\|/g,'') // remove something like |...|
            .replace(/\(.*\)/g,'') // remove something like (...)
            .replace(/\[.*\]/g,'') // remove something like [...]
            .replace(/\./g,' ') // convert from dots to space
            .replace(/-.*$/,'')     //remove something like -...
            .replace(/ +(?= )/g,'') // remove multiple spacing
            .trim()
          return {
              [germanForm]: meaning,
          }
        })
        .get() // take the result as an array
        .reduce((result,formMeaningDict) => {
          let key = Object.keys(formMeaningDict)[0]
          let explanation = formMeaningDict[key]
          return Object.assign({},result,{
            [key]: (result[key] || []).concat([explanation]) // push the meaning to the corresponding key, create it if it doesnt exist
          })
        },{}) // default is an empty object
        return Object.keys(formExplanations)
          .filter(k => { // take away useless keys
            // by useless it means there are some other words other than the list below
            console.log('k:')
            console.log(k)

            let recognizableTerms = dropTerms
                .concat([word])
                .concat(prepositions)
                .concat(verbForms)

            return !(k.split(' ').reduce((isInvalid,term) => (recognizableTerms.indexOf(term) == -1) || isInvalid,false))
          })
          .map(k => {
                return {
                  meaning:formExplanations[k].join(';'),
                  usage: getVerbUsage(k.split(' '))
                }
              } // join the meanings of this particular usage to a single line
          )
    })
}
/*
  Parameters:
    dom: a DOM
  return:
    list of words, or null when there are errors in parsing,

  word format:
    - Verb: {
        word: string,
        meanings: [
          {
            meaining: "...",
          }
        ]
    }
*/
//2.
export const getDetailedWord =
  word => {
    let searchURL = `https://en.wiktionary.org/wiki/${word}`

    return urlToDOM(searchURL)
      .then($ => {
        let germanHeaderSelector = 'h2:has(span#German)'

        //3.
        if($(germanHeaderSelector).length == 0) return null

        //4.
        let elementsAtMiddle = $('h2:has(span#German)').nextUntil('h2:has(span)')
        let formList = elementsAtMiddle
          .map(function(i,e) {
            return $(this).find('span').first().text()
          })
          .get()
          .filter(f => supportedWordType.indexOf(f) != -1)

        if(formList.length == 0) return null
        return Promise.all(formList.map(form =>
          {
            let displayForm = form.toLowerCase()
            if(form != "verb"){
              //5a.
              // new Promise(() =>
                let meanings = $(`h3:has(span#${form})`) // get the h3 tag of that form
                .first() // and that the first one
                .nextUntil('h3:has(span)','ol') // take up to next section
                .first()
                .find('> li') // get immediate child
                .map(function(i,el) {
                  return $(this).find('ul')
                    .remove()
                    .end()
                    .text().replace(/\r|\n/,'').trim()
                })
                .get()
                return {
                  word,
                  form: displayForm,
                  meanings,
                }
            }

            else {
              getVerbMeaning(word)
              .then(meanings => {
                return {
                  word,
                  form: displayForm,
                  meanings,
                }
              })
            }



          })
        )
      })
      .then(wordList => {
        // form a word entry here
        console.log('word list:')
        console.log(wordList)
        return wordList
      })

  }
