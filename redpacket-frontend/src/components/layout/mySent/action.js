import { listSenderRedPackets } from '../../util/api'
import {getCurrentAddress} from "../../util/utils";

const getMySent = (currency) => {
  return (dispatch) => {
    return listSenderRedPackets({address: getCurrentAddress()}, currency)
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
