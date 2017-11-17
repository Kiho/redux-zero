import { getList, postData, remove } from '../api';

const middleware = store => action => {
    let meth;
    let actionToText = String(action);
    if (actionToText.indexOf('get,') > 7)
        meth = getList;
    if (actionToText.indexOf('post,') > 7)
        meth = postData;
    if (actionToText.indexOf('remove,') > 7)
        meth = remove;
    if (meth) {
        store.setState({ loading: true });
        return (state, path, body) => meth(path, body)
                .then(data => ({ loading: false, [path]: data }))
                .catch(error => ({ error, loading: false }))
    }
    return action;
};

export default middleware