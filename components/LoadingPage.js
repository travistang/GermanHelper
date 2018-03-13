import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {styles} from '../App'

export default class LoadingPage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        App is loading
      </View>
    )
  }
}
