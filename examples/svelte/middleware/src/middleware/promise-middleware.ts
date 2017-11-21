import { actions } from "../asyncActions";
import * as api from '../api';

function getActionKeys(actions) {
    return Object.keys(typeof actions === "function" ? actions() : actions);
}
const actionKeys = getActionKeys(actions);

const middleware = store => (action, name) => {
    const meth = actionKeys.find(x => x === name);
    if (meth) {
        store.setState({ loading: true });
        return (state, path, body) => api[meth](path, body)
                .then(data => ({ [path]: data, loading: false }))
                .catch(error => ({ error, loading: false }))
    }
    return action;
};

export default middleware