import createStore from 'redux-zero';
import { applyMiddleware } from 'redux-zero/middleware';
import devtoolsMiddleware from './dev-tools';

const initialState = { count: 1 };
const middlewares = devtoolsMiddleware ? applyMiddleware(devtoolsMiddleware.connect(initialState)): [];
const store = createStore(initialState, middlewares);

export default store;
