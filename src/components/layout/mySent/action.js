import { listSenderRedPackets } from '../../util/api'

const getMySent = () => {
  return (dispatch) => {
    return listSenderRedPackets({address:window.bytom.default_account.address})
      .then((resp)=>{
        dispatch({
          type: "UPDATE_MY_SENT_DETAILS",
          mySentDetails: resp.data
        })
      })
      .catch((err) => {
        throw err
      })
  }
}

let actions = {
  getMySent
}

export default actions
