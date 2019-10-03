export default (state, action) => {
  switch (action.type) {
    case "UPDATE_OPEN_PACKET_DETAILS":
      return {
        ...state,
        packetDetails: action.packetDetails
      };
    case "UPDATE_MY_SENT_DETAILS":
      return {
        ...state,
        mySentDetails: action.mySentDetails
      };
    case "UPDATE_MY_RECEIVED_DETAILS":
      return {
        ...state,
        myReceivedDetails: action.myReceivedDetails
      };
    case "UPDATE_BYTOM":
      return {
        ...state,
        bytom: action.bytom
      };
    case "UPDATE_BYTOM_CONNECTION":
      return {
        ...state,
        bytomConnection: action.bytomConnection
      };
    default:
      return state
  }
}