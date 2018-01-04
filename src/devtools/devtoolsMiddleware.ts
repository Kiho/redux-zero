let devTools = { devTools: null }
let connect
const nextActions = []
const REPLAY_INTERVAL = 100

function getOrAddAction(action, fn) {
  let found = (<any>nextActions).find(x => action.name === x.key)
  if (!found) {
    found = { key: action.name, fn }
    nextActions.push(found)
    console.log("getOrAddAction", found)
  }
  return found
}

function replay(store, message) {
  const state = JSON.parse(message.state)
  for (let key in state.actionsById) {
    console.log("replay", key, message.payload)
    const thisAction = state.actionsById[key].action
    if (parseInt(key, 10) <= message.payload.id) {
      setTimeout(() => {
        if (thisAction.type === "initialState") {
          store.setState(state.computedStates[0].state)
        } else {
          let found = (<any>nextActions).find(x => thisAction.type === x.key)
          if (found) {
            found.fn()
            console.log("replay", thisAction.type, store.getState())
          }
        }
      }, REPLAY_INTERVAL)
    }
  }
}

function update(message) {
  if (message.type === "DISPATCH") {
    if (
      message.payload.type === "JUMP_TO_ACTION" ||
      message.payload.type === "JUMP_TO_STATE"
    ) {
      this.setState(JSON.parse(message.state))
    } else if (message.payload.type === "TOGGLE_ACTION") {
      replay(this, message)
    }
  }
}

function subscribe(store, middleware) {
  if (!middleware.initialized) {
    const storeUpdate = update.bind(store)
    devTools.devTools.subscribe(storeUpdate)
    middleware.initialized = true
  }
}

const devtoolsMiddleware = store => next => action => {
  let result = next(action)
  subscribe(store, devtoolsMiddleware)
  console.log("devtoolsMiddleware", action)
  getOrAddAction(action, () => next(action))
  devTools.devTools.send(action.name, store.getState())
  return result
}

if (window !== undefined && (<any>window).__REDUX_DEVTOOLS_EXTENSION__) {
  connect = function(initialState) {
    devTools.devTools = (<any>window).__REDUX_DEVTOOLS_EXTENSION__.connect()
    devTools.devTools.send("initialState", initialState)
    return devtoolsMiddleware
  }
}

export { devtoolsMiddleware, connect, update, devTools, getOrAddAction }
