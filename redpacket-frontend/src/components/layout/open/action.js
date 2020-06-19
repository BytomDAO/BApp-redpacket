import {
  openRedPacket
} from '../../util/api'
import {getCurrentAddress} from "../../util/utils";

export function open(value,redPackId, currency) {
  const address = getCurrentAddress()
  const password = value.password

  return openRedPacket({
    "red_packet_id": redPackId,
    "address": address,
    "password": password
  }, currency)
}
