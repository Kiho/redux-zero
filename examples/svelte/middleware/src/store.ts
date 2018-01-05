import createStore from "redux-zero";
import { applyMiddleware } from "redux-zero/middleware";
import logger  from './middleware/logger-middleware';
import promise  from './middleware/promise-middleware';

const initialState = { count: 0, people: [] };
const middlewares = applyMiddleware(
    logger,
    promise,
);
const store = createStore(initialState, middlewares);

export default store;