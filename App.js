import React from 'react';
//import { AppLoading, Font } from 'expo';
import { AppRegistry,StyleSheet, Text, View } from 'react-native';
import FlashcardPage from './components/flashcards/FlashcardPage'
import { StackNavigator } from 'react-navigation';
import commonStyles from './Style'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
// import reducer from './reducers/search'
import reducerMain from './reducers'
// import LoadingPage from './components/LoadingPage'
// export const store = createStore(reducerMain)
export const store = createStore(reducerMain)
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // display: 'flex',
    height: '100%',
    width: '100%',
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    // fontFamily: 'Lato',
    // color: 'white',
    backgroundColor: commonStyles.primaryColor3.backgroundColor
  },
});


const StackNav = StackNavigator(
  {
    Flashcard: {
      screen: FlashcardPage,
    },
  },
  {
  //   navigationOptions: {
  //     headerMode: 'screen',
  //     headerBackground: 'commonStyles.primaryColor2'
  //   }
  }
)

export default class App extends React.Component {

  constructor(props) {
    super(props)
    // setInterval(() => {console.log(store.getState())},2000)
    this.state = {
      isReady: false,
    }
  }

  render() {
    return (
      <Provider store={store}>
        <StackNav />
      </Provider>
    )
  }
}
