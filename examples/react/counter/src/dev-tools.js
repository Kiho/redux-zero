let devtoolsMiddleware;
let devTools;
const nextActions = [];

// if we have redux devtools
if (window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
  function getOrAddAction(action, fn) {
    let found = nextActions.find(x => {
      console.log('actions.find', action.name, String(action));
      return action.name === x.key;
    });
    if (!found) {
      found = { key: action.name, fn };
      nextActions.push(found);
    }
    return found;
  }

  function replay(store, message) {
    const state = JSON.parse(message.state);
    for(let key in state.actionsById) {
      setTimeout(() => {
        const thisAction = state.actionsById[key].action;
        if (parseInt(key, 10) <= message.payload.id) {          
          if (thisAction.type === 'initialState') {
            store.setState(state.computedStates[0].state);
          } else {
            let found = nextActions.find(x => thisAction.type === x.key);
            if (found) {
              found.fn();
              console.log('replay', thisAction.type, store.getState());
            }
          }
        }
      }, 100);
    }
  }

  function subscribe(store, middleware) {
    if (middleware.initialized) return;
    //subscribe to devtools jump to action & toggle action
    devTools.subscribe(message => {
      if (message.type === 'DISPATCH'){
        if (
          (message.payload.type === 'JUMP_TO_ACTION' || message.payload.type === 'JUMP_TO_STATE')
        ) {
          store.setState(JSON.parse(message.state));
        } else if (message.payload.type === 'TOGGLE_ACTION') {
          replay(store, message);
        }
      }      
    });
    middleware.initialized = true;
  }

  //create middleware to watch the store
  devtoolsMiddleware = store => next => action => {
    let result = next(action);
    subscribe(store, this);
    getOrAddAction(action, () => next(action));
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