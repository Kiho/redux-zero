import { actions } from "../asyncActions";
import * as api from '../api';

function getActionKeys(actions) {
    return Object.entries(typeof actions === "function" ? actions() : actions);
}
const actionKeys = getActionKeys(actions).map(x => ({ key: x[0], fn: String(x[1]) }));

const middleware = store => (action, name) => {
    let actionToFn = String(action);
    const meth = actionKeys.find(x => {
        // console.log('actionKeys.find', actionToFn == x.fn, name, actionToFn);
        return actionToFn === x.fn && name === x.key;
    });
    if (meth) {
        store.setState({ loading: true });
        return (state, path, body) => api[meth.key](path, body)
                .then(data => ({ [path]: data, loading: false }))
                .catch(error => ({ error, loading: false }))
    }
    return action;
};

export default middleware