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

let actions = {
  setBytom,
  updateConnection
}

export default actions
