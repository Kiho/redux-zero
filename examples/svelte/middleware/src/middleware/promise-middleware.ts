import { actions } from "../asyncActions";
import * as api from '../api';

function linkActions(actions) {
    actions = typeof actions === "function" ? actions() : actions
    let bound = {}
    for (let name in actions) {
        bound[name] = actions[name];
    }  
    return bound
}

const asyncActions = linkActions(actions);
const middleware = store => (action, name) => {
    const meth: any = Object.keys(asyncActions).find(x => x === name);
    if (meth) {
        store.setState({ loading: true });
        return (state, path, body) => api[meth](path, body)
                .then(data => ({ [path]: data, loading: false }))
                .catch(error => ({ error, loading: false }))
    }
    return action;
};

export default middleware