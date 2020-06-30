const setBytom = (bytom) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_BYTOM",
      bytom
    })
  }
}

const updateConnection = (bytomConnection) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_BYTOM_CONNECTION",
      bytomConnection
    })
  }
}

const finishedPageLoad = () => {
  return (dispatch) => {
    dispatch({
      type: "FINISHED_PAGE_LOAD"
    })
  }
}

let actions = {
  setBytom,
  updateConnection,
  finishedPageLoad
}

export default actions
