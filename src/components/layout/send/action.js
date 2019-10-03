import {
  spendWalletAction, controlAddressAction
} from '../../util/bytomAction'
import { createRedPacket, submitRedPacket
} from '../../util/api'
import { BTM } from '../../util/constants'
import BigNumber from 'bignumber.js'

export function sendRedPack(value,isNormalType) {
  const password = value.password
  const amount = Number(value.amount)
  const number = Number(value.number)
  const note = value.word

  const unitAmount = new BigNumber(100000000)

  return new Promise((resolve, reject) => {
    return createRedPacket({
      "password": password
    }).then(resp=>{
      const contractAddress = resp.address
      const redPackId = resp.red_packet_id

      const input = []
      const output = []

      let totalAmount

      if(isNormalType){
        totalAmount = BigNumber(amount).times(number)

        for(let i = 0; i <number; i++){
          output.push(controlAddressAction(unitAmount.times(BigNumber(amount)).toNumber(), BTM, contractAddress))
        }
      }else{
        totalAmount = amount

        const numberArray = generateRandom(number, totalAmount)

        numberArray.forEach((randomAmount)=>{
          output.push(controlAddressAction(unitAmount.times(BigNumber(randomAmount)).toNumber(), BTM, contractAddress))
        })

      }

      const inputAmount = BigNumber(totalAmount)

      input.push(spendWalletAction(unitAmount.times(inputAmount).toNumber() ,BTM))

      return window.bytom.send_advanced_transaction({
        input,
        output,
        gas:0
      }).then((res)=>{
        return submitRedPacket({
          "red_packet_id": redPackId,
          "tx_id": res.transaction_hash,
          "address": window.bytom.default_account.address,
          "amount": unitAmount.times(totalAmount).toNumber(),
          "password": password,
          "red_packet_type":isNormalType? 0:1,
          "note": note
        }).then(() =>{
          resolve(redPackId)
        }).catch(err => {
          throw err
        })
      }).catch(err => {
        throw err.message
      })
    }).catch(err => {
      reject(err)
    })
  })
}

function generateRandom(count, sum){
  let result = []
  let money = sum

  for (let i=0;i<count - 1;i++) {
    const value = parseFloat((Math.random() * (money/(count-result.length)*2 - 0.01) + 0.01).toFixed(2) )
    result.push(value)
    money = money - value
  }
  result.push(parseFloat(money.toFixed(2)))

  return result
}
