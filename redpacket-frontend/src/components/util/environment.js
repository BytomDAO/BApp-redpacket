function url(currency=''){
  const bytom = window.bytom
  const symbol = (currency).toUpperCase()
  if(bytom){
    if(symbol === 'DAI'){
      switch (bytom.net) {
        case "testnet":
          return "http://52.82.55.89:3101/dapp"
          break
        case "solonet":
          return "http://52.82.55.89:3101/dapp"
        default:
          return "https://bapp.bystack.com/dapp"
      }
    }else{
      switch (bytom.net) {
        case "testnet":
          return "http://52.82.55.89:3100/dapp"
          break
        case "solonet":
          return "http://52.82.55.89:3100/dapp"
          break
        default:
          return "https://bapp.bystack.com/dapp"
      }
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
