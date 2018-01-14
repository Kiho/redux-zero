import createStore from "redux-zero";
import { applyMiddleware } from "redux-zero/middleware";
import logger  from './middleware/logger-middleware';
import promise  from './middleware/promise-middleware';
import { connect } from '../../../../devtools';

const initialState = { count: 0, people: [] };
const devtools = connect ? connect(initialState) : null;
const middlewares = applyMiddleware(
    promise,
    devtools,
);
const store = createStore(initialState, middlewares);

export default store;