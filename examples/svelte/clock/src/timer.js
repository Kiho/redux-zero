import store from "./store";

function create() {
    return setInterval(() => {
        store.setState({ time: new Date() });
    }, 1000 );
}

export { create }