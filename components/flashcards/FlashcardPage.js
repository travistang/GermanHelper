import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
 } from 'react-native';
import Flashcard from './Flashcard'
import commonStyles from '../../Style'
import Header from '../header/Header'
import { connect } from 'react-redux'
import SearchResult from './SearchResult'
class FlashcardPage extends React.Component {
  static navigationOptions = {
    title: 'Flashcards',
    headerStyle: commonStyles.primaryColor2,
    headerTitleStyle: {
      color: 'white'
    },

    header: <Header title="Flashcards" />
    // drawer: () => ({
    //   label: 'Flashcard'
    // })
  }

  constructor(props) {
    super(props)
    // store.subscribe(() => {
    //   let word = this.props.store.getState().searchWords
    //   if(this.searchWords != word) {
    //     console.log('subscribe: search word is now:' + word)
    //     this,searchWords = word
    //   }
    // })

    this.words = [
      {
        word: 'machen',
        type: 'verb',
        participle1: 'machend',
        participle2: 'gemacht',
      },
      {
          word: 'machen',
          type: 'verb',
          participle1: 'machend',
          participle2: 'gemacht',
      },
      {
        word: 'machen',
        type: 'verb',
        participle1: 'machend',
        participle2: 'gemacht',
      },
      {
          word: 'machen',
          type: 'verb',
          participle1: 'machend',
          participle2: 'gemacht',
      },
      {
        word: 'machen',
        type: 'verb',
        participle1: 'machend',
        participle2: 'gemacht',
      },
      {
          word: 'machen',
          type: 'verb',
          participle1: 'machend',
          participle2: 'gemacht',
      },
      {
        word: 'machen',
        type: 'verb',
        participle1: 'machend',
        participle2: 'gemacht',
      },
      {
          word: 'machen',
          type: 'verb',
          participle1: 'machend',
          participle2: 'gemacht',
      },
      {
        word: 'machen',
        type: 'verb',
        participle1: 'machend',
        participle2: 'gemacht',
      },
      {
          word: 'machen',
          type: 'verb',
          participle1: 'machend',
          participle2: 'gemacht',
      },
    ]
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: this._rowHasChanged,
      }).cloneWithRows(this.props.searchResults)
    }

  }
  componentWillReceiveProps(nextProps) {
   this.setState({
     dataSource: this.state.dataSource.cloneWithRows(nextProps.searchResults)
   })

 }
  _renderFlashcard(word) {
    return <Flashcard word={word}/>
  }
  _rowHasChanged(r1,r2) {
    console.log('row has changed')
    return r1.word == r2.word && r1.type == r2.type
  }
  // _onDataArrived(newData) {
  //   this.words.concat(newData)
  //   this.setState({
  //     dataSource:this.dataSource.cloneWithRows(this.words)
  //   })
  // }
  render() {
    return (
      
      this.props.isEnteringSearchWord?(<SearchResult/>):(
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderFlashcard}
          style={[style.main,commonStyles.primaryColor3]}>
        </ListView>)

    )
  }

}

const style = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  main: {
    height: '100%',
    width: '100%',
    // paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    // paddingBottom: 80,
  }
})

const stateToProp = (state) => {
  console.log('receiving state')
  console.log(state)
  return {
    searchResults: state.searchReducer.searchResults,
    isLoading: state.searchReducer.isSearching,
    isEnteringSearchWord: state.searchReducer.isEnteringSearchWord,
    // searchResults: state.searchReducer.searchResults
  }
}
export default connect(stateToProp,null)(FlashcardPage)
