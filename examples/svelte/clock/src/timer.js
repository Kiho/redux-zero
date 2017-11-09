import store from "./store";

function create() {
    store.setState({ time: new Date() });
    return setInterval(() => {
        store.setState({ time: new Date() });
    }, 1000 );
}

export { store, create }