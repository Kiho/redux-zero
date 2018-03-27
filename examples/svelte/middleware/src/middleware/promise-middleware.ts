import { actions } from "../asyncActions";
import * as api from '../api';

function getActionKeys(actions) {
    return Object.entries(typeof actions === "function" ? actions() : actions);
}
const actionKeys = getActionKeys(actions).map(x => ({ key: x[0], fn: String(x[1]) }));

const middleware = store => next => action => {
    let actionToFn = String(action);
    const meth = actionKeys.find(x => {
        return actionToFn === x.fn && action.name === x.key;
    });
    if (meth) {
        store.setState({ loading: true });
        const asyncAction = (state, path, body) => api[meth.key](path, body)
                .then(data => ({ [path]: data, loading: false }))
                .catch(error => ({ error, loading: false }));
        return next(asyncAction)        
    }
    return next(action);
};

export default middleware