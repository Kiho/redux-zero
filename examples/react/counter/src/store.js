import createStore from 'redux-zero';
import { applyMiddleware } from 'redux-zero/middleware';
import { connect } from 'redux-zero/devtools';

const initialState = { count: 1 };
const middlewares = connect ? applyMiddleware(connect(initialState)): [];
const store = createStore(initialState, middlewares);

export default store;