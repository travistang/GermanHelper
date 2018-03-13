let initialState = {
  // searchWord: '',
  searchResults: [],
  isSearching: false,
  hasError: false,
  isEnteringSearchWord: false,
}
const searchReducer = (state = initialState,action) => {
  switch(action.type) {
    case 'SET_SEARCH_WORD': {
      return Object.assign({},state,{
        searchWord: action.word
      })
    }
    case 'SET_SEARCH_RESULTS': {
      return Object.assign({},state,{
        searchResults: action.results
      })
    }
    case 'ADD_SEARCH_RESULTS': {
      return Object.assign({},state,{
        searchResults: state.searchResults.concat(action.results)
      })
    }
    case 'SET_IS_SEARCHING':
      return Object.assign({},state,{
        isSearching: action.status
      })
    case 'SET_HAS_ERROR':
      return Object.assign({},state,{
        hasError: action.error
      })
    case 'TOGGLE_IS_ENTERING_SEARCH_WORD':
      return Object.assign({},state,{
        isEnteringSearchWord: !(state.isEnteringSearchWord)
      })

    case 'SET_IS_ENTERING_SEARCH_WORD':
      return Object.assign({},state,{
        isEnteringSearchWord: action.status
      })
    default:
      return state
  }
}

export default searchReducer
