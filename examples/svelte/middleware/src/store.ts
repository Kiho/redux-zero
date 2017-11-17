import createStore  from '../../../..';
import logger  from './middleware/logger-middleware';
import promise  from './middleware/promise-middleware';

const initialState = { count: 0, people: [] };
const store = createStore(initialState, promise, logger);

export default store;