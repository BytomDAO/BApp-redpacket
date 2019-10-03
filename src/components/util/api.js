import axios from "axios/index";
import { url} from './environment';

//Api call from Buffer server
export function createRedPacket(params)
{
  let link = `${url()}/create-redpacket`
  return post(link, params).then(resp => resp.data)
}

export function submitRedPacket(params)
{
  let link = `${url()}/submit-redpacket`
  return post(link, params)
}

export function getRedPacketPassword(params)
{
  let link = `${url()}/get-redpacket-password`
  return post(link, params)
}

export function openRedPacket(params)
{
  let link = `${url()}/open-redpacket`
  return post(link, params)
}

export function getRedPacketDetials(params)
{
  let link = `${url()}/get-redpacket-details`
  return post(link, params)
}

export function listReceiverRedPackets(params)
{
  let link = `${url()}/list-receiver-redpackets`
  return post(link, params)
}

export function listSenderRedPackets(params)
{
  let link = `${url()}/list-sender-redpackets`
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