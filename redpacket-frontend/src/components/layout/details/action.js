import { getRedPacketDetials } from '../../util/api'

const getRedpackDetails = (redpackId = '') => {
  return (dispatch, getState) => {
    const currency =  getState().currency || 'BTM'
    return getRedPacketDetials({red_packet_id: redpackId}, currency)
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
