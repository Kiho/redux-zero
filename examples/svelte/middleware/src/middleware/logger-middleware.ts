const middleware = store => next => action => {
  console.log('states', store.getState()) // okay, we can console.log state on every action execution
  console.log('action', action.name) // some function. which function?
  return next(action);
  // return highOrderFunction(action) // add some high order fn?
}
export default middleware