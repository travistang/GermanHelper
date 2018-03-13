import React from 'react'
import Header from '../components/header/Header'
// import {dispatch} from 'react-redux'

// import {dispatch} from 'react-redux'
export default class HeaderContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log('store in container:')
    console.log(this.store)
    return (
      <Header
          title={this.props.title}
          onSearch={this.props.onSearch}
      />
    )
  }
}
