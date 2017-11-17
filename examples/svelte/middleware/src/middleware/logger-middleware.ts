const middleware = store => action => {
  console.log(store.getState()) // okay, we can console.log state on every action execution
  console.log(action) // some function. which function?
  return action
  // return highOrderFunction(action) // add some high order fn?
}
export default middleware