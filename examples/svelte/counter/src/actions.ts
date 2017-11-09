export const actions = store => ({
    increment: state => ({ count: state.count + 1 }),
    decrement: state => ({ count: state.count - 1 }),
    incrementOf: (state, step) => ({ count: state.count + step }),
    decrementOf: (state, step) => ({ count: state.count - step }),
});