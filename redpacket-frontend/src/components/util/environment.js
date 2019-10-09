function url(){
  const bytom = window.bytom
  if(bytom){
    const isVapor = bytom.chain === 'vapor'
    switch (bytom.net) {
      case "testnet":
        return "http://app.bycoin.io:3120/dapp"
        break
      case "solonet":
        return isVapor? "http://app.bycoin.io:3130/dapp":""
        break
      default:
        return "https://bapp.bystack.com/dapp"
    }
  }
  return 'https://bapp.bystack.com/dapp'
}

let  basename
if (process.env.NODE_ENV === 'production') {
  basename = '/redpacket'
} else {
  basename = ''
}

export {
  url,
  basename
};
