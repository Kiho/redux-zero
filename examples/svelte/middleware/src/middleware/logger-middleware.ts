const middleware = store => next => action => {
  console.log("state before change", store.getState());
  const result = next(action).then(() => {
    console.log("state after change", store.getState());
  }); 
  return result;
}
export default middleware