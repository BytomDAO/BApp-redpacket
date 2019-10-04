import GetContractArgs from "../constants";
import { updateUtxo } from './api'

export function submitContract(listDepositUTXO, createContractTransaction, updateDatatbaseBalance, object) {
  const address = object.address
  const amount = object.amount
  const updateParameters = object.parameter

  return new Promise((resolve, reject) => {
    //list available utxo
    return listDepositUTXO().then(resp => {

      //create the Contract Transaction
      return createContractTransaction(resp, amount, address).then(object =>{
        const input = object.input
        const output = object.output
        const args = object.args

        const utxo = object.utxo

        //Lock UTXO
        return updateUtxo({"hash": utxo})
          .then(()=>{

            //Transactions
            window.bytom.advancedTransfer(input, output, GetContractArgs().gas*100000000, args, 1)
              .then((resp) => {
                if(resp.action === 'reject'){
                  reject('user reject the request')
                }else if(resp.action === 'success'){

                  //Update Balance
                  return updateDatatbaseBalance(resp, ...updateParameters).then(()=>{
                    resolve()
                  }).catch(err => {
                    throw err
                  })
                }
              })
              .catch(err => {
                throw err
              })
          })
          .catch(err => {
            throw err
          })
      }).catch(err => {
        throw err
      })
    }).catch(err => {
      reject(err)
    })
  })
}
