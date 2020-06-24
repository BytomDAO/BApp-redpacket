import { listSenderRedPackets } from '../../util/api'
import {getCurrentAddress} from "../../util/utils";

const getMySent = (assetId) => {
  return (dispatch) => {
    return listSenderRedPackets({address: getCurrentAddress(),asset_id: assetId})
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
