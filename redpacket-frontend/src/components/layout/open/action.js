import {
  openRedPacket
} from '../../util/api'

export function open(value,redPackId) {
  const address = window.bytom.default_account.address
  const password = value.password

  return openRedPacket({
    "red_packet_id": redPackId,
    "address": address,
    "password": password
  })
}
