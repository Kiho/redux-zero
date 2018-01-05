import createStore from ".."
import applyMiddleware from "../middleware/applyMiddleware"
import {
  devtoolsMiddleware,
  update,
  devTools,
  getOrAddAction
} from "./devtoolsMiddleware"

const increment = ({ count }) => ({ count: count + 1 })
const decrement = ({ count }) => ({ count: count - 1 })
const getActions = ({ getState }) => ({
  increment,
  decrement
})
jest.useFakeTimers()

function bindActions(actions, store) {
  actions = typeof actions === "function" ? actions(store) : actions

  let bound = {}
  for (let name in actions) {
    bound[name] = (...args) => {
      const action = actions[name]
      if (typeof store.middleware === "function") {
        return store.middleware(store, action, args)
      }

      return set(store, action(store.getState(), ...args))
    }
  }
  console.log("bound", bound)
  return bound
}

describe("devtoolsMiddleware", () => {
  it("should jump to new action", () => {
    const jumpToAction1 = {
      type: "DISPATCH",
      payload: { type: "JUMP_TO_ACTION" },
      state: '{"count":2}'
    }
    
    const store = createStore({ count: 0 })
    const storeUpdate = update.bind(store)

    storeUpdate(jumpToAction1)
    expect(store.getState()).toEqual({ count: 2 })

    const jumpToAction2 = {
      type: "DISPATCH",
      payload: { type: "JUMP_TO_ACTION" },
      state: '{"count":3}'
    }

    storeUpdate(jumpToAction2)
    expect(store.getState()).toEqual({ count: 3 })
  })
  it("should jump to new state", () => {

    const jumpToState1 = {
      type: "DISPATCH",
      payload: { type: "JUMP_TO_STATE" },
      state: '{"count":4}'
    }

    const store = createStore({ count: 0 })
    const storeUpdate = update.bind(store)

    storeUpdate(jumpToState1)
    expect(store.getState()).toEqual({ count: 4 })

    const jumpToState2 = {
      type: "DISPATCH",
      payload: { type: "JUMP_TO_STATE" },
      state: '{"count":5}'
    }

      storeUpdate(jumpToState2)
      expect(store.getState()).toEqual({ count: 5 })
  })
 
  it("should replay actions to current action", () => {
    const initialState = { count: 1 }
    const middlewares = applyMiddleware(devtoolsMiddleware)

    const store = createStore(initialState, middlewares)
    const actions = bindActions(getActions, store)

    devTools.devTools = { send: () => {}, subscribe: () => {} }

    console.log("action name", Object.keys(actions))

    Object.keys(actions).forEach(key => {
      getOrAddAction({ name: key }, actions[key])
    })

    const toggleAction1 = {
      type: "DISPATCH",
      payload: { type: "TOGGLE_ACTION", id: 1 },
      state: `{"actionsById":{"0":{"action":{"type":"initialState"},"timestamp":1514964802390,"type":"PERFORM_ACTION"},
        "1":{"action":{"type":"increment"},"timestamp":1514964812877,"type":"PERFORM_ACTION"},
        "2":{"action":{"type":"decrement"},"timestamp":1514964817322,"type":"PERFORM_ACTION"}},
        "computedStates":[{"state":{"count":1}},{"state":{"count":2}},{"state":{"count":1}}],
        "currentStateIndex":2,"nextActionId":3,"skippedActionIds":[],"stagedActionIds":[0,1,2]}`
    }

    const storeUpdate = update.bind(store)
    storeUpdate(toggleAction1)

    expect(store.getState().count).toBe(1)

    jest.runAllTimers()
    console.log("toggleAction", store.getState())

    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(store.getState()).toEqual({ count: 2 })

    
    const toggleAction2 = {
      type: "DISPATCH",
      payload: { type: "TOGGLE_ACTION", id: 2 },
      state: `{"actionsById":{"0":{"action":{"type":"initialState"},"timestamp":1514964802390,"type":"PERFORM_ACTION"},
        "1":{"action":{"type":"increment"},"timestamp":1514964812877,"type":"PERFORM_ACTION"},
        "2":{"action":{"type":"decrement"},"timestamp":1514964817322,"type":"PERFORM_ACTION"}},
        "computedStates":[{"state":{"count":1}},{"state":{"count":2}},{"state":{"count":1}}],
        "currentStateIndex":2,"nextActionId":3,"skippedActionIds":[],"stagedActionIds":[0,1,2]}`
    }

    storeUpdate(toggleAction2)

    expect(store.getState().count).toBe(2)
    
    jest.runAllTimers()
    console.log("toggleAction", store.getState())
    
    expect(store.getState()).toEqual({ count: 1 })
  })
})
