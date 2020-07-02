import {
  spendWalletAction, controlAddressAction
} from '../../util/bytomAction'
import {
  createRedPacket, submitRedPacket, listTransaction
} from '../../util/api'
import { BTM } from '../../util/constants'
import BigNumber from 'bignumber.js'
import {decimals} from "@/components/util/constants";

Promise.wait = (time) => new Promise(resolve => setTimeout(resolve, time || 0));
Promise.retry = (cont, fn, delay) => fn().catch(err => cont > 0 ? Promise.wait(delay).then(() => Promise.retry(cont - 1, fn, delay)) : Promise.reject(err));

export function sendRedPack(value,isNormalType) {
  const password = value.password
  const amount = BigNumber(value.amount)
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
          totalAmount = amount.times(number)

          for(let i = 0; i <number; i++){
            output.push(controlAddressAction((amount).toString(), assetId, contractAddress))
          }
        }else{
          totalAmount = amount

          const numberArray = generateRandom(number, totalAmount, assetId === BTM? 0.01: 0.00001)

          numberArray.forEach((randomAmount)=>{
            output.push(controlAddressAction(randomAmount, assetId, contractAddress))
          })

        }

        const inputAmount = totalAmount

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

          const numberArray = generateRandom(number, totalAmount, assetId === BTM? 0.01: 0.00001)

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

function generateRandom(c, sum, min = 0.01){
  let result = []
  const count = BigNumber(c)
  let remainTotal = sum.minus(count.times(min))
  for (let i=0;i<count - 1;i++) {
    const value = ((remainTotal.div(count-result.length).times(2)).times(Math.random())).toFixed(2)
    result.push(BigNumber(value).plus(min))
    remainTotal = remainTotal.minus(value)
  }
  result.push(remainTotal.plus(min))

  return result
}