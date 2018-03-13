import React from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    PanResponder,
    Animated,

    TouchableWithoutFeedback
} from 'react-native';
import commonStyles from '../../Style'

export default class Flashcard extends React.Component {
  constructor(prop) {
    super(prop)
    this.maxDetailViewHeight = 200
    this.state = {
      isDetailViewExpanded: false,
      detailViewAnimatedValue: new Animated.Value(0),
    }
    this.panResponder = new PanResponder.create({
      onStartShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onMoveShouldSetResponderCapture: () => true,
      // onPanResponderMove : (e,gesture) => {
      //   console.log(gesture.dy)
      //   this.setState({
      //     detailViewAnimatedValue: gesture.dy
      //
      //   })
      // },
      onPanResponderRelease: (e,gesture) => {
        // TODO: on release:
        /*
          If the resulting state is smaller than minimum, make it back to minimum,
          Otherwise make it to be maximum

        */
      }
    })
  }
  getMeanings() {
    if(this.props.word.form == 'verb')
      return `${this.props.word.meanings.usage}\n${this.props.word.meanings.meanings}`
    else
      return this.props.word.meanings
  }
  getHeaderAuxInfo() {
    let type = this.props.word.type
    switch(type) {
      case "verb":
        return 'p. II: ' + this.props.word.participle2
      case "noun":
        return "noun"
      case "adjective":
      default:
        return 'adjective'

    }
  }
  getDetailedViewHeight() {
    return {
      // height: 48,
      height: this.state.detailViewAnimatedValue
    }
  }
  toggleDetailView() {
    Animated.timing(this.state.detailViewAnimatedValue,{
      duration: 200,
      toValue: this.state.isDetailViewExpanded?0:this.maxDetailViewHeight
    }).start(() => {
      this.state.isDetailViewExpanded = !this.state.isDetailViewExpanded
    })
  }
  editMeaning() {
    // TODO: edit meaning overlay
    console.log('edit meaning')
  }
  render() {


    return (
      <View style={styles.flashcard}>
        <View
          style={[styles.flashcardHeader,commonStyles.primaryColor2]}>

          <Text style={[styles.flashcardHeaderWord,commonStyles.h2]}> {this.props.word.word} </Text>
          <View style={styles.flashcardHeaderAuxInfo}>
            <Text style={[styles.flashcardHeaderWordType,commonStyles.h4]}>{this.props.word.form}</Text>
            <Text style={[commonStyles.h4]}>{this.getHeaderAuxInfo()}</Text>
          </View>
        </View>

        <Animated.View style={[styles.flashcardDetailInitial,commonStyles.primaryColor4,this.getDetailedViewHeight()]} >
          <Text> Some grammar </Text>
        </Animated.View>

        <TouchableWithoutFeedback
          onPress={this.toggleDetailView.bind(this)}
          onLongPress={this.editMeaning.bind(this)}
        >
          <View style={[styles.flashcardBottom,commonStyles.primaryColor]}>
            <Text style={[commonStyles.h4]}>{this.getMeanings()}</Text>
          </View>
        </TouchableWithoutFeedback>

      </View>
    )
  }
}

// TODO: render list of meanings for the flashcards

const styles = StyleSheet.create({
  flashcard: {
      // left: 20,
      // right: 20,
      marginBottom: 4,
      width: '100%',
  },
  flashcardHeader: {
    height: 48,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  flashcardHeaderWord: {
    marginLeft: 12,
  },
  flashcardHeaderAuxInfo: {
    marginLeft: 42,

  },
  flashcardHeaderWordType: {
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  },
  flashcardBottom: {
    height: 48,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flashcardDetailInitial: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    overflow: 'hidden',
    // height: 0,
    // borderBottomLeftRadius:5,
    // borderBottomRightRadius: 5,
    // borderTopLeftRadius: 5,
    // borderTopRightRadius: 5,
  }
})
