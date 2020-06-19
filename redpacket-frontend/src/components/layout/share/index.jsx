import React from 'react'
import { copyToClipboard } from '../../util/clipboard'
import { toastMsg, getCurrentAddress } from "../../util/utils";
import {Link } from 'react-router-dom'
import {getPassword} from "./action";
import {withTranslation} from "react-i18next";
import action from "../details/action";
import {connect} from "react-redux";
import LogoContainer from '../logoContainer'

import{basename} from "../../util/environment";

require('./style.scss')

class Share extends React.Component {
  constructor(props){
    super(props)
    this.showPassword = this.showPassword.bind(this)
  }

  componentDidMount() {
    this.props.getDetails(this.props.match.params.id)
  }

  copyClick(){
    copyToClipboard(`${window.location.origin}${basename}/open/${this.props.match.params.id}#${this.props.currency}`)
    toastMsg(this.props.t('share.copied'))
  }

  showPassword(e){
    e.preventDefault()
    getPassword(this.props.match.params.id, getCurrentAddress(), this.props.currency).then((resp)=> {
      const password = resp.data.password
      toastMsg(`${this.props.t('share.code')}:${password}`)
    })
  }

  render() {
    const { t } = this.props;

    const packetDetails = this.props.packetDetails

    const title = packetDetails&& packetDetails.note

    return (
      <LogoContainer>
        <div className="shared__container redPacket__container">
          <div className="open__header">{title}</div>
          <div className="open__hint">{t('share.hint')}</div>

          <div className="shared__component">
            <Link className="btn-primary share__copy_button" to={`/qrCode/${this.props.match.params.id}`}>{t('share.qrCode')}</Link>

            <div>
                <button className="btn btn-link link__btn" onClick={this.copyClick.bind(this)}>
                  <img className="icon" src={require('../../img/icon/qrCode.png')} alt=""/> {t('share.copy')}
                </button>
                <div className="vertical_separator"></div>
                <button className="btn btn-link link__btn" onClick={(e)=>this.showPassword(e)}>
                  <img className="icon" src={require('../../img/icon/codeShare.png')} alt=""/> {t('share.viewCode')}
                </button>
            </div>
          </div>
        </div>
      </LogoContainer>
    )
  }
}

const mapStateToProps = state => ({
  packetDetails: state.packetDetails,
  currency: state.currency
})

const mapDispatchToProps = dispatch => ({
  getDetails: (redPackId) => dispatch(action.getRedpackDetails(redPackId)),
})

export default  connect(mapStateToProps,mapDispatchToProps)(withTranslation()(Share))
