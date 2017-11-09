import createStore  from 'redux-zero';

const initialState = { time: new Date() };
const store = createStore(initialState);

export default store;