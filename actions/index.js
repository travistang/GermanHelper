export const addWord = (word) => {
  return {
    type: 'ADD_WORD',
    word: word,
  }
}

export const removeWord = (word) => {
  return {
    type: 'REMOVE_WORD',
    word: word,
  }
}


export const setSearchResults = (results) => {
  return {
    type: 'SET_SEARCH_RESULTS',
    results: results
  }
}

export const setIsSearching = (status) => {
  return {
    type: 'SET_IS_SEARCHING',
    status: status
  }
}

export const setHasError = (error) => {
  return {
    type: 'SET_HAS_ERROR',
    error: error
  }
}

export const toggleIsEnteringSearchWord = () => {
  return {
    type: 'TOGGLE_IS_ENTERING_SEARCH_WORD'
  }
}

export const setIsEnteringSearchWord = (bool) => {
  return {
    type: 'SET_IS_ENTERING_SEARCH_WORD',
    status: bool
  }
}

export const addSearchResults = (results) => {
  return {
    type: 'ADD_SEARCH_RESULTS',
    results: results
  }
}
export const setSearchWord = (word) => {
  return {
    type: 'SET_SEARCH_WORD',
    word: word,
  }
}
