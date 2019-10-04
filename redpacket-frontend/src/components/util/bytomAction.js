export function spendUTXOAction(utxo){
  return {
    "type": "spend_utxo",
    "output_id": utxo
  }
}

export function contractArguments(amount, address){
  return [
    {
      "type": "integer",
      "value": amount
    },
    {
      "type": "address",
      "value": address
    },
    {
      "type": "data",
      "value": ""
    }
  ]
}

export function spendWalletAction(amount, asset){
  return {
    "amount": amount,
    "asset": asset,
    "type": "spend_wallet"
  }
}

export function controlProgramAction(amount, asset, program){
  return {
    "amount": amount,
    "asset": asset,
    "control_program": program,
    "type": "control_program"
  }
}

export function controlAddressAction(amount, asset, address){
  return {
    "amount": amount,
    "asset": asset,
    "address": address,
    "type": "control_address"
  }
}


