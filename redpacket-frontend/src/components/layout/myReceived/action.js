import { listReceiverRedPackets } from '../../util/api'

const getMyReceived = () => {
  return (dispatch) => {
    return listReceiverRedPackets({address:window.bytom.default_account.address})
      .then((resp)=>{
        dispatch({
          type: "UPDATE_MY_RECEIVED_DETAILS",
          myReceivedDetails: resp.data
        })
      })
      .catch((err) => {
        throw err
      })
  }
}

let actions = {
  getMyReceived
}

export default actions
