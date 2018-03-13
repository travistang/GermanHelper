import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  ListView,
  TouchableOpacity,
  Keyboard,
  Dimensions
 } from 'react-native';
import Flashcard from './Flashcard'
import {DotsLoader} from 'react-native-indicator'
import { connect } from 'react-redux';

 class SearchResult extends React.Component {
   constructor(prop) {
     super(prop)
     this.searchResultExtendedHeight = Dimensions.get('window').height

     this.state = {
       searchResultHeight: new Animated.Value(0),
       dataSource: new ListView.DataSource({
         rowHasChanged: this._rowHasChanged,
       }).cloneWithRows(this.props.searchResults)
     }

    this.componentWillReceiveProps(this.props)
   }
   _rowHasChanged(r1,r2) {
     return r1.word == r2.word && r1.type == r2.type
   }
   _renderFlashcard(word) {
     console.log('render flashcard word')
     console.log(word)
     return (
      <Flashcard word={word} />
     )

   }
   componentWillReceiveProps(nextProps) {
     console.log('receiving props for search result')
     this.setState({
       dataSource: this.state.dataSource.cloneWithRows(nextProps.searchResults)
     })
     if(nextProps.shouldExpand) {
       console.log('expand')
       this.expand()
     }
     else {
       console.log('collapse')
       this.collapse()
     }
   }

   getSearchResultStyle() {
     return {
       height: this.state.searchResultHeight,
       width: '100%',
       // display: 'flex',
       // alignItems: 'center',
       // justifyContent: 'center'
     }
   }
   componentWillMount() {

   }

   expand() {

     Animated.timing(this.state.searchResultHeight,{
       toValue: this.searchResultExtendedHeight,
       duration: 600,
     }).start()
   }
   collapse() {
     Animated.timing(this.state.searchResultHeight, {
       toValue: 0
     }).start()
   }
   showIndicator() {
     if(this.props.isLoading) {
       return (
         <View style={style.indicator}>
          <DotsLoader style={style.indicator} color="white"/>
         </View>
       )
     }
     return null
   }

   render() {
     return (
       <Animated.View style={[this.getSearchResultStyle(),commonStyles.primaryColor2]}>
        {this.showIndicator()}
         <ListView
           enableEmptySections={true}
           dataSource={this.state.dataSource}
           renderRow={this._renderFlashcard}
           style={[]}>
         </ListView>

       </Animated.View>
     )
   }
 }

const stateToProp = (state) => {
  return {
    isLoading: state.searchReducer.isSearching,
    searchResults: state.searchReducer.searchResults,
    shouldExpand: state.searchReducer.isEnteringSearchWord,
  }
}

const style = StyleSheet.create({
  main: {
    height: 0,
    width: '100%'
  },
  indicator: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
export default connect(stateToProp,null)(SearchResult)
