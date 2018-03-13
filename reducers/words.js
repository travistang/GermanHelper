let initialState = {
  words: [],
}

const wordsReducer = (state = initialState,action) => {
  switch(action.type) {
    case 'ADD_WORD':
      return Object.assign({},state,{
        words: action.word
      })
    case 'REMOVE_WORD':
      return Object.assign({},state,{
        words: state.words.filter((w) => w != action.word)
      })
    default:
      return state
  }
}

export default wordsReducer
