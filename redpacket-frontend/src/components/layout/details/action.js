import { getRedPacketDetials } from '../../util/api'

const getRedpackDetails = (redpackId = '') => {
  return (dispatch) => {
    return getRedPacketDetials({red_packet_id: redpackId})
      .then((resp)=>{
        dispatch({
          type: "UPDATE_OPEN_PACKET_DETAILS",
          packetDetails: resp.data
        })
      })
      .catch((err) => {
        throw err
      })
  }
}

let actions = {
  getRedpackDetails,
}

export default actions
