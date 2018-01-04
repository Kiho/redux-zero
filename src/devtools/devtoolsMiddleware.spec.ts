import createStore from ".."
import { devtoolsMiddleware } from "./devtoolsMiddleware"
import { update } from "./devtoolsMiddleware"

const jumpToAction = {type:"DISPATCH", payload:{type:"JUMP_TO_ACTION"}, state:'{"count":3}' }
const jumpToState = {type:"DISPATCH", payload:{type:"JUMP_TO_STATE"}, state:'{"count":4}' }
const toggleAction = {type:"DISPATCH", payload:{type:"TOGGLE_ACTION", id:1}, 
  state:'{"actionsById":{"0":{"action":{"type":"initialState"},"timestamp":1514964802390,"type":"PERFORM_ACTION"},"1":{"action":{"type":"increment"},"timestamp":1514964812877,"type":"PERFORM_ACTION"},"2":{"action":{"type":"decrement"},"timestamp":1514964817322,"type":"PERFORM_ACTION"}},"computedStates":[{"state":{"count":1}},{"state":{"count":2}},{"state":{"count":1}}],"currentStateIndex":2,"nextActionId":3,"skippedActionIds":[],"stagedActionIds":[0,1,2]}' }

describe("devtoolsMiddleware", () => {
    it("should jump to new action", () => {
      const store = createStore({count:0})
      const storeUpdate = update.bind(store)

      storeUpdate(jumpToAction)
      console.log('jumpToAction', store.getState())
      expect(store.getState()).toEqual({count:3})
    })
    it("should jump to new state", () => {
      const store = createStore({count:0})
      const storeUpdate = update.bind(store)

      storeUpdate(jumpToState)
      console.log('jumpToState', store.getState())
      expect(store.getState()).toEqual({count:4})
    })
    it("should replay actions to current action", () => {
      const store = createStore({count:0})
      const storeUpdate = update.bind(store)

      Promise.resolve(() => storeUpdate(toggleAction))
            .then(() => {
              console.log('toggleAction', store.getState())
            })
      // expect(store.getState()).toEqual('{"actionsById":{"0":{"action":{"type":"initialState"},"timestamp":1514964802390,"type":"PERFORM_ACTION"},"1":{"action":{"type":"increment"},"timestamp":1514964812877,"type":"PERFORM_ACTION"},"2":{"action":{"type":"decrement"},"timestamp":1514964817322,"type":"PERFORM_ACTION"}},"computedStates":[{"state":{"count":1}},{"state":{"count":2}},{"state":{"count":1}}],"currentStateIndex":2,"nextActionId":3,"skippedActionIds":[],"stagedActionIds":[0,1,2]}"}')

    })
})