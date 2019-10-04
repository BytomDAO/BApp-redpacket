import React, {
  Component
} from 'react'
import {connect} from "react-redux";
import {BTM} from "../../util/constants";
import { toastMsg } from "../../util/utils";
import { copyToClipboard } from '../../util/clipboard'
import { withTranslation } from 'react-i18next';

require('./style.scss')

class Footer extends Component {

  constructor(props) {
    super(props);
    this.copyAddress = this.copyAddress.bind(this)
  }

  copyAddress(e, account){
    e.preventDefault()
    copyToClipboard(account.address)
    toastMsg(this.props.t('share.copied'))
  }

  render () {
    const { t , balanceObject, account } = this.props;

    let balance =  0.00
    if(balanceObject && balanceObject.balance){
      balance = balanceObject.balance/Math.pow(10, balanceObject.decimals)
    }

    return (
      <div className="footer">
          <div className="text-left amount__container footer__content">
            <div className="footer__content_item">
              <div >{t('common.balances')}: </div>
              <div className="text-secondary">{ balance } BTM</div>
            </div>
            <div className="footer__content_item">
              <div>{t('common.address')}: </div>
              { account && <div className="text-secondary">{account.address} <a onClick={(e)=>this.copyAddress(e, account)}>
                <img className="icon" src={require('../../../static/img/icon/copy.png')} alt=""/></a>
              </div>}
            </div>

          </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  const account = state.bytom && state.bytom.default_account

  let balanceObject
  if(account && account.balances &&account.balances.length>0) {
    balanceObject = account.balances.filter(b => b.asset === BTM)[0]
  }

  return ({
    bytom: state.bytom,
    balanceObject,
    account
  })
}

export default connect(mapStateToProps)(withTranslation()(Footer))
