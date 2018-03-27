import createStore from "redux-zero";
import { applyMiddleware } from "redux-zero/middleware";
import localStorageMiddleware  from './middleware/local-storage-middleware';
import promise  from './middleware/promise-middleware';
import { connect } from 'redux-zero/devtools';

const initialState = { count: 0, people: [] };
const devtools = connect ? connect(initialState) : null;
const middlewares = applyMiddleware(
    promise,
    localStorageMiddleware,
    devtools,
);
const store = createStore(initialState, middlewares);
(localStorageMiddleware as any).init(store, 'my-app');
export default store;