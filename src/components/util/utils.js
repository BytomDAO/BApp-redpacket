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