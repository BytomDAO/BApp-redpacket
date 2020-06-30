import {
  spendWalletAction, controlAddressAction
} from '../../util/bytomAction'
import {
  createRedPacket, submitRedPacket, listTransaction
} from '../../util/api'
import { IdMapTest, IdMap } from '../../util/constants'
import BigNumber from 'bignumber.js'
import {decimals} from "@/components/util/constants";

Promise.wait = (time) => new Promise(resolve => setTimeout(resolve, time || 0));
Promise.retry = (cont, fn, delay) => fn().catch(err => cont > 0 ? Promise.wait(delay).then(() => Promise.retry(cont - 1, fn, delay)) : Promise.reject(err));

export function sendRedPack(value,isNormalType) {
  const password = value.password
  const amount = Number(value.amount)
  const number = Number(value.number)
  const alias = value.alias.trim()
  const bytom = window.bytom
  const assetId  = value.assetId

  return new Promise((resolve, reject) => {
    return createRedPacket({
      "password": password,
    }).then(resp=>{
      const contractAddress = resp.address
      const redPackId = resp.red_packet_id

      const input = []
      const output = []
      let totalAmount

      if(bytom && bytom.version ){

        if(isNormalType){
          totalAmount = BigNumber(amount).times(number)

          for(let i = 0; i <number; i++){
            output.push(controlAddressAction((BigNumber(amount)).toString(), assetId, contractAddress))
          }
        }else{
          totalAmount = amount

          const numberArray = generateRandom(number, totalAmount)

          numberArray.forEach((randomAmount)=>{
            output.push(controlAddressAction(BigNumber(randomAmount).toString(), assetId, contractAddress))
          })

        }

        const inputAmount = BigNumber(totalAmount)

        input.push(spendWalletAction(inputAmount.toString() ,assetId))

        const requestObject = {
          red_packet_id: redPackId,
          address: window.bytom.defaultAccount.address,
          amount: (totalAmount).toString(),
          password: password,
          red_packet_type:isNormalType? 0:1,
        }

        if(alias){
          requestObject.address_name = alias
        }

        return window.bytom.sendAdvancedTransaction({
          input,
          output,
          gas:0
        }).then((res)=>{
          const txHash = res.transactionHash
          requestObject.tx_id = txHash

          let delay = 300;
          let tries = 10;
          return Promise.retry(tries, ()=>{return listTransaction(txHash)}, delay).then(() => {
            return submitRedPacket(requestObject).then(() => {
              resolve(redPackId)
            }).catch(err => {
              throw err
            })
          })

        }).catch(err => {
          throw err.message
        })

      }
      else{
        const currency = value.currency
        const currencyDecimals = decimals[currency]

        const unitAmount = new BigNumber(1).shiftedBy(currencyDecimals || 0)

        if(isNormalType){
          totalAmount = BigNumber(amount).times(number)

          for(let i = 0; i <number; i++){
            output.push(controlAddressAction(unitAmount.times(BigNumber(amount)).toNumber(), assetId, contractAddress))
          }
        }else{
          totalAmount = amount

          const numberArray = generateRandom(number, totalAmount)

          numberArray.forEach((randomAmount)=>{
            output.push(controlAddressAction(unitAmount.times(BigNumber(randomAmount)).toNumber(), assetId, contractAddress))
          })

        }

        const inputAmount = BigNumber(totalAmount)

        input.push(spendWalletAction(unitAmount.times(inputAmount).toNumber() ,assetId))

        const requestObject = {
          red_packet_id: redPackId,
          address: window.bytom.default_account.address,
          amount: totalAmount.toString(),
          password: password,
          red_packet_type:isNormalType? 0:1,
        }
        if(alias){
          requestObject.address_name = alias
        }

        return window.bytom.send_advanced_transaction({
          input,
          output,
          gas:0
        }).then((res)=>{

          const txHash = res.transaction_hash || res.transactionHash
          requestObject.tx_id = txHash

          let delay = 300;
          let tries = 10;
          return Promise.retry(tries, ()=>{return listTransaction(txHash)}, delay).then(() => {
            return submitRedPacket(requestObject).then(() => {
              resolve(redPackId)
            }).catch(err => {
              throw err
            })
          })

        }).catch(err => {
          throw err.message
        })

      }

    }).catch(err => {
      reject(err)
    })
  })
}

function generateRandom(count, sum){
  let result = []
  let remainTotal = sum - count*0.01
  for (let i=0;i<count - 1;i++) {
    const value = parseFloat((Math.random() * (remainTotal/(count-result.length)*2)).toFixed(2) )
    result.push(parseFloat((value+0.01).toFixed(2)))
    remainTotal = remainTotal - value
  }
  result.push(parseFloat((remainTotal+0.01).toFixed(2)))

  return result
}