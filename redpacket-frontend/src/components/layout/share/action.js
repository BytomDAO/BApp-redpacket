import {
  getRedPacketPassword
} from '../../util/api'

export function getPassword(redPackId, address) {
  return getRedPacketPassword({
    "red_packet_id": redPackId,
    "sender_address": address,
  })
}
