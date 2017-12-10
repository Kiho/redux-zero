let devtoolsMiddleware;
let devTools;

// if we have redux devtools
if (window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
  function subscribe(store, middleware) {
    if (middleware.initialized) return;
    //subscribe to devtools jump to action
    devTools.subscribe(message => {
      if (
        message.type === 'DISPATCH' &&
        (message.payload.type === 'JUMP_TO_ACTION' || message.payload.type === 'JUMP_TO_STATE')
      ) {
        store.setState(JSON.parse(message.state));
      }
    });
    middleware.initialized = true;
  }

  //create middleware to watch the store
  devtoolsMiddleware = store => next => action => {
    let result = next(action);
    subscribe(store, this);
    devTools.send(action.name, store.getState());
    return result;
  };

  devtoolsMiddleware.connect = function(initialState) {
    //connect to devtools
    devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect();
    //send the initial state
    devTools.send('initialState', initialState);
    return this;
  }
} 

export default devtoolsMiddleware;