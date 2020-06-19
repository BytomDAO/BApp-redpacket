import {
  getRedPacketPassword
} from '../../util/api'

export function getPassword(redPackId, address, currency) {
  return getRedPacketPassword({
    "red_packet_id": redPackId,
    "sender_address": address,
  }, currency)
}
