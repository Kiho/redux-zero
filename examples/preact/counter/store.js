import createStore from "redux-zero";
import { applyMiddleware } from 'redux-zero/middleware';
import { connect } from '../../../devtools';
import { bindActions  }  from 'redux-zero/utils';

const initialState = { count: 1, loading: false, payload: {} };

const middlewares = connect ? applyMiddleware(connect(initialState)): [];
const store = createStore(initialState, middlewares);

const actions = store => ({
  dispatch: (state, args) => {
    return Object.assign(state, args);
  },
});
export const { dispatch } = bindActions(actions, store);

export default store;