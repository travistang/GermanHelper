import { combineReducers } from 'redux'
import searchReducer from './search'
import wordsReducer from './words'

const mainReducers = combineReducers({
  searchReducer,
  wordsReducer,
})

export default mainReducers
