export default reducer => (state, action) => (action.type === 'SET_STATE'
    ? action.payload
    : reducer(state, action));
