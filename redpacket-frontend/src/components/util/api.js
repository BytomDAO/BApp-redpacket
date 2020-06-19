import axios from "axios/index";
import { url} from './environment';

//Api call from Buffer server
export function createRedPacket(params, currency)
{
  let link = `${url(currency)}/create-redpacket`
  return post(link, params).then(resp => resp.data)
}

export function submitRedPacket(params, currency)
{
  let link = `${url(currency)}/submit-redpacket`
  return post(link, params)
}

export function getRedPacketPassword(params, currency)
{
  let link = `${url(currency)}/get-redpacket-password`
  return post(link, params)
}

export function openRedPacket(params, currency)
{
  let link = `${url(currency)}/open-redpacket`
  return post(link, params)
}

export function getRedPacketDetials(params, currency)
{
  let link = `${url(currency)}/get-redpacket-details`
  return post(link, params)
}

export function listReceiverRedPackets(params, currency)
{
  let link = `${url(currency)}/list-receiver-redpackets`
  return post(link, params)
}

export function listSenderRedPackets(params, currency)
{
  let link = `${url(currency)}/list-sender-redpackets`
  return post(link, params)
}

function post(link, params){
  return axios({
    method: 'post',
    url:link,
    data: params
  }).then(response => {
    if(response.data.code === 200){
      return response.data.result;
    }else{
      throw response.data.msg
    }
  })
}