import { listReceiverRedPackets } from '../../util/api'
import {getCurrentAddress} from "../../util/utils";

const getMyReceived = (assetId) => {
  return (dispatch) => {
    return listReceiverRedPackets({address:getCurrentAddress(), asset_id: assetId})
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
