import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
  Keyboard
 } from 'react-native';
import {getDetailedWord} from '../../utils'
import commonStyles from '../../Style'
import {
  addSearchResults,
  setSearchResults,
  setIsSearching,
  setIsEnteringSearchWord,
  setSearchWord,
} from '../../actions'
import {store} from '../../App'
import { connect } from 'react-redux';
class Header extends React.Component {
  constructor(props) {
    super(props)

    this.defaultSearchBarFlex = 10
    this.onFocusSearchBarFlex = 8
    this.defaultCancelButtonFlex = 0.1
    this.defaultCancelButtonTranslation = 200

    this.state = {
      ajaxCallTimeout: null,
      searchBarFlex: new Animated.Value(this.defaultSearchBarFlex),
      cancelButtonFlex: 2,
      cancelButtonTranslation: new Animated.Value(this.defaultCancelButtonTranslation),

      isFocusingSearchBox: false,
    }
  }
  onSearch(searchWord) {
    this.props.onSearch(searchWord)
  }
  onInput(searchWord) {
    let waitingTime = 1000
    // cancel the previous timeout
    if(this.state.ajaxCallTimeout) {
      clearTimeout(this.state.ajaxCallTimeout)
    }
    this.setState({
      ajaxCallTimeout: setTimeout((() => {
          // TODO: async tasks here

          this.onSearch(searchWord.trim())
          clearTimeout(this.state.ajaxCallTimeout)
      }).bind(this),waitingTime)
    })
  }
  // for dynamic style
  searchBarFlexStyle() {
    return {
      flex: this.state.searchBarFlex
    }
  }
  cancelButtonFlexStyle() {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flex: this.state.cancelButtonFlex,
      transform: [
        {'translateX': this.state.cancelButtonTranslation}
      ]
    }
  }
  onSearchBarFocus() {
    this.showCancelButton()
    this.props.onFocus()
  }
  onSearchBarBlur() {
    this.hideCancelButton()
  }
  showCancelButton() {
    this.setState({isFocusingSearchBox: true})
    let animationDuration = 300
    Animated.sequence([
      Animated.timing(this.state.searchBarFlex,{
        toValue: this.onFocusSearchBarFlex,
        duration: animationDuration,
      }),
      Animated.timing(this.state.cancelButtonTranslation, {
        toValue: 0,
        duration: animationDuration / 2,
      })
      // Animated.timing(this.state.cancelButtonFlex,{
      //   toValue: this.defaultSearchBarFlex - this.onFocusSearchBarFlex,
      //   duration: animationDuration
      // })
    ]).start()
  }
  hideCancelButton() {
    this.setState({isFocusingSearchBox: false})
    let animationDuration = 500
    Animated.sequence([
      Animated.timing(this.state.searchBarFlex,{
        toValue: this.defaultSearchBarFlex,
        duration: animationDuration,
      }),
      Animated.timing(this.state.cancelButtonTranslation,{
        toValue: this.defaultCancelButtonTranslation,
        duration: animationDuration
      })
    ]).start()
  }
  clearSearchText() {
    // this.onSearchBarBlur()
    this.props.onFocus()
    this.refs.searchBar.blur()
    this.refs.searchBar.clear()
    Keyboard.dismiss()
  }
  onCancelButtonPressed() {
    this.clearSearchText()
    this.props.onCancel()

  }
  renderCancelButton() {
    if(this.state.isFocusingSearchBox) return (
      <Animated.View style={this.cancelButtonFlexStyle()}>
        <TouchableOpacity
          style={[style.cancelButton]}
          onPress={this.onCancelButtonPressed.bind(this)}
        >
          <Text style={[commonStyles.h4,style.cancelButtonText]}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
    )
    return null
  }
  render() {
    return (
      <View style={[style.main,commonStyles.primaryColor2]}>
        <Text style={[style.text,commonStyles.h2]}> {this.props.title} </Text>
        <View style={style.searchBarContainer}>
          <Animated.View style={this.searchBarFlexStyle()}>
            <TextInput
              ref="searchBar"
              placeholderTextColor="white"
              underlineColorAndroid='rgba(0,0,0,0)'
              onChangeText={ this.onInput.bind(this) }
              onFocus={this.onSearchBarFocus.bind(this)}
              onBlur={this.onSearchBarBlur.bind(this)}
              style={[style.searchBarStyle,commonStyles.h5]}
              placeholder="Type some German here..."
            />
          </Animated.View>
          {this.renderCancelButton()}
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  text: {
    color: 'white'
  },
  main: {
    height: 120,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  searchBarStyle: {
    width: '100%',
    height: 36,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingLeft: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  cancelButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cancelButtonText: {
    overflow: 'hidden'
  },
  searchBarContainer: {
    // height: 36,
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
    width: '100%',
    display: 'flex',
    flexDirection: 'row'
  }
})
const mapDispatch = (dispatch) => {
  return {
    onSearch: searchWord => {
      dispatch(setSearchResults([]))
      dispatch(setSearchWord(searchWord))
      if(searchWord.length == 0) {
        return
      }
      let searchResultNumber = 6
      // toggle flag
      dispatch(setIsSearching(true))
      fetch(`https://en.wiktionary.org/w/api.php?action=opensearch&limit=${searchResultNumber}&format=json&search=${searchWord}`)
      .then(response => response.json())
      .then(response => response[1]) // list of search result
      .then(wordList => {
        // toggle flag
        return Promise.all(
          wordList
            .filter(w => w.split(' ').length == 1) // no split words
            .map(word => getDetailedWord(word)
            .then(word => {
              // TODO: count the number of words in total
              // TODO: check if the word has changed
              console.log('store.getState().searchReducer.searchWord')
              console.log(store.getState().searchReducer.searchWord)
              console.log('searchWord')
              console.log(searchWord)
              if(word != null && store.getState().searchReducer.searchWord == searchWord)dispatch(addSearchResults((typeof word == 'object')?word:[word]))
            })
          )
        ).then(() => {
          // when the fetched word has finished
          // TODO: minus the number of german words, fetch the remaining
          dispatch(setIsSearching(false))
        })
      })
      .catch(e => {
        console.log('error')
        console.log(e)
        dispatch(setIsSearching(false))
      })
    },
    onFocus: () => {
      dispatch(setIsEnteringSearchWord(true))
    },
    onCancel: () => {
      dispatch(setIsEnteringSearchWord(false))
    }
  }
}
export default connect(null,mapDispatch)(Header)
