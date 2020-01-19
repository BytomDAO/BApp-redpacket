import React from 'react'
import QRCode from 'qrcode'
import action from "../details/action";
import { getPassword } from "../share/action";
import {connect} from "react-redux";
import address from "../../util/address";
import {withTranslation} from "react-i18next";
import Logo from '../logo'
import {sleep} from '../../util/utils'
import {basename} from "../../util/environment";

require('./style.scss')

class QrCode extends React.Component {
  constructor(props){
    super(props)
    this.state={
      url: '',
      password:''
    }
    this.fetchData = this.fetchData.bind(this)
  }

  fetchData(){
    let opts = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      rendererOpts: {
        quality: 0.3
      }
    }

    const that = this

    const { t } = this.props;

    const setStateAsync = (state) => {
      return new Promise((resolve) => {
        this.setState(state, resolve)
      });
    }

    QRCode.toDataURL(`${window.location.origin}${basename}/open/${this.props.match.params.id}`, opts)
      .then(url => {
        return setStateAsync({url:url})
      })
      .then(()=>{
        return this.props.getDetails(this.props.match.params.id)
      })
      .then(()=>{
        return getPassword(this.props.match.params.id, this.props.bytom.default_account.address)
      })
      .then((resp)=> {
        return setStateAsync({ password: resp.data.password})
      })
      .then(()=> {
        return sleep(300)
      })
      .then(()=>{
          if(window.bycoin){
            window.bycoin.callAPI('native.saveScreenshot', function (err, ret) {
              if(ret){
                window.bycoin.callAPI('native.confirm', {
                  title: t('qrCode.backTitle'),
                  message: t('qrCode.backMsg'),
                  cancelText: t('common.no'),
                  confirmText: t('common.yes'),
                }, function(err, result) {
                  if(err) {
                    console.log('no')
                  } else {
                    that.props.history.goBack();
                  }
                })
              }
            })
          }
        }
      )
      .catch(err => {
        throw err
      })
  }

  componentDidMount(){
    if(this.props.bytom){
      this.fetchData()
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.bytom && this.props.bytom !== prevProps.bytom ) {
      this.fetchData();
    }
  }

  render() {
    const { t } = this.props;

    if(!this.props.packetDetails){
      return <div>{t('common.notFound')}</div>
    }
    const packetDetails = this.props.packetDetails

    const senderAddress = address.short(packetDetails.sender_address)

    return (
      <div className="container__wrapper">
        <div className="outer__container">
          <div className="text-center">
            <Logo/>
          </div>
          <div className="redPacket__container qrCode__container">
            <div className="mb-2 ml-4 mr-4">{packetDetails.note}</div>
            <div className="qrCode mb-4">
              {
                this.state.url &&
                <img src={this.state.url}/>
              }
            </div>
            {senderAddress && <p>{senderAddress}{t('qrCode.spacket')}</p>}
            <div className="mt-2 code_box ml-auto mr-auto">{this.state.password}</div>
          </div>
          <div className="d-flex">
            <div className="mr-3">
              <img className="bycoin_img" src={require('../../../static/img/bycoin.png')}/>
            </div>
            <div>
              <div className="hint-item text-white">
                {t('qrCode.downloadHint')}
              </div>
              <div className="hint-item text-white">
                {t('qrCode.passwordHint')}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  packetDetails: state.packetDetails,
  bytom: state.bytom
})

const mapDispatchToProps = dispatch => ({
  getDetails: (redPackId) => dispatch(action.getRedpackDetails(redPackId)),
})

export default connect(mapStateToProps,mapDispatchToProps)(withTranslation()(QrCode))
