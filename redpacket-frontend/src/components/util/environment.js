function url(){
  const bytom = window.bytom
  if(bytom){
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
  return 'https://bapp.bystack.com/dapp'
}

let  basename
if (process.env.NODE_ENV === 'production') {
  basename = '/bapp/redpacket'
} else {
  basename = ''
}

export {
  url,
  basename
};
