import React, {
  Component,
} from 'react'
import {connect} from "react-redux";
import { toastMsg } from "../../util/utils";
import { copyToClipboard } from '../../util/clipboard'
import { withTranslation } from 'react-i18next';

require('./style.scss')

class Footer extends Component {
  constructor(props) {
    super(props);
    this.copyAddress = this.copyAddress.bind(this)
    this.updateBalance = this.updateBalance.bind(this)
    this.state={
      BtmBalance: 0
    }
  }

  updateBalance(props) {
    const { account, bytom, currency } = props;

    if(bytom && bytom.version){
      bytomJs.getBalance(account.address).then((balances) => {
        if (balances && balances.length > 0) {
          const balance = balances.filter(b => b.symbol === currency)[0]
          this.setState({
            BtmBalance: balance
          })
        }
      })
    }else{
      bytomJsV1.getBalance(account.accountId).then((balances) => {
        if (balances && balances.length > 0) {
          const balance = balances.filter(b => b.symbol === currency)[0]
          this.setState({
            BtmBalance: balance
          })
        }
      })
    }
    const that = this
    this.timer = setTimeout(function(){ that.updateBalance(props) }, 50000);
  }

  componentDidMount(){
    this.updateBalance(this.props)
  }

  componentWillUpdate(nextProps) {
    if(this.props.currency !== nextProps.currency) {
      this.updateBalance(nextProps)
    }
  }

  componentWillUnmount() {
    // Is our timer running?
    if (this.timer) {
      // Yes, clear it
      clearTimeout(this.timer);
    }
  }
  copyAddress(e, account){
    e.preventDefault()
    copyToClipboard(account.address)
    toastMsg(this.props.t('share.copied'))
  }

  render () {
    const { t , account, bytom, currency } = this.props;
    const { BtmBalance } = this.state

    let balance =  0.00
    if(BtmBalance){
      if(bytom && bytom.version){
        balance = BtmBalance.availableBalance
      }else{
        balance = BtmBalance.availableBalance/Math.pow(10, BtmBalance.decimals)
      }
    }

    return (
      <div className="footer">
          <div className="text-left amount__container footer__content">
            <div className="footer__content_item">
              <div >{t('common.balances')}: </div>
              <div className="text-secondary">{ balance } {currency}</div>
            </div>
            <div className="footer__content_item">
              <div>{t('common.address')}: </div>
              { account && <div className="text-secondary">{account.address} <a onClick={(e)=>this.copyAddress(e, account)}>
                <img className="icon" src={require('../../img/icon/copy.png')} alt=""/></a>
              </div>}
            </div>

          </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  const account = state.bytom && state.bytom.default_account
  const currency = state.currency && state.currency.toUpperCase()

  return ({
    bytom: state.bytom,
    currency: currency,
    account
  })
}

export default connect(mapStateToProps)(withTranslation()(Footer))
