import {
  getRedPacketPassword
} from '../../util/api'

export function getPassword(redPackId) {
  const address = window.bytom.default_account.address

  return getRedPacketPassword({
    "red_packet_id": redPackId,
    "sender_address": address,
  })
}
