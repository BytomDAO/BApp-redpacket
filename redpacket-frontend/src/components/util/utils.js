import BigNumber from 'bignumber.js'

export function toastMsg(msg){
  if(window.bycoin){
    window.bycoin.callAPI('native.toastInfo', msg)
  }else{
    window.alert(msg)
  }
}

export function sleep(ms) {
  let temple = new Promise(
    (resolve) => {
      setTimeout(resolve, ms)
    });
  return temple
}

export function getCurrentAddress(){
  const bytom = window.bytom
  if (bytom && bytom.defaultAccount){
    return bytom.defaultAccount.address
  }else if(bytom &&  bytom.default_account){
    return bytom.default_account.address
  }else{
    return ''
  }
}

export function formateNumber(n, decimals){
  const x = new BigNumber(n)

  return x.shiftedBy(-decimals).toString()
}
