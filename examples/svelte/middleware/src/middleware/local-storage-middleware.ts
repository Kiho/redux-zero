let myKey;

function setLocalStorage(store) {
    localStorage.setItem(myKey, JSON.stringify(store.getState()));
    // console.log("local-storage-middleware - state after change", store.getState());
}

const middleware = store => next => action => {
    let result = next(action);
    if (result && result.then) {
        // setLocalStorage(store); 
        return result.then(() => setLocalStorage(store));
    }
    setLocalStorage(store); 
    return result;
}

(middleware as any).init = function(store, key) {
    const json = localStorage.getItem(myKey = key);
    if (json) {
        store.setState(JSON.parse(json));
        // console.log("local-storage-middleware - init store", store.getState());
    }
}

export default middleware;