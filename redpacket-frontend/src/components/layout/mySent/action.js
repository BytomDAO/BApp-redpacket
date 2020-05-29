import { listSenderRedPackets } from '../../util/api'
import {getCurrentAddress} from "../../util/utils";

const getMySent = () => {
  return (dispatch) => {
    return listSenderRedPackets({address: getCurrentAddress()})
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
