import { listReceiverRedPackets } from '../../util/api'
import {getCurrentAddress} from "../../util/utils";

const getMyReceived = (currency) => {
  return (dispatch) => {
    return listReceiverRedPackets({address:getCurrentAddress()}, currency)
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
