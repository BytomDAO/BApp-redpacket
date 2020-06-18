import React, {
  Component
} from 'react'
import { connect } from "react-redux"
import address from '../../util/address'
import action from "./action";
import _ from 'lodash'
import { timeDifference } from "../../util/time";
import {Link } from 'react-router-dom'
import {withTranslation} from "react-i18next";
import LogoContainer from '../logoContainer'
import moment from "moment/moment";
import { getCurrentAddress, formateNumber } from "../../util/utils";
import { decimals } from '@/components/util/constants'

require('./style.scss')

class RedPackDetails extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getDetails(this.props.match.params.id)
  }

  componentWillUpdate(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.props.getDetails(this.props.match.params.id)
    }
  }

  render () {
    const { t, currency } = this.props;
    const currencyDecimals = decimals[currency]

    if(!this.props.packetDetails){
      return <div></div>
    }

    const packetDetails = this.props.packetDetails

    const winners = packetDetails.winners
    const myAddress = getCurrentAddress()

    const isNormalType = packetDetails.red_packet_type===0
    let myRedPack,label
    let list = []
    if(winners){

      myRedPack = winners.filter(winner => winner.address === myAddress)[0]

      let maxAmount

      if(winners.length === packetDetails.total_number && winners.length > 0){
        const date1 = new Date(_.maxBy(winners, 'confirmed_time').confirmed_time * 1000)
        const date2 = new Date(packetDetails.send_time *1000)
        const timeDiff = timeDifference(date1, date2)
        label = t('detail.finished', {total:packetDetails.total_number, amount:formateNumber(packetDetails.total_amount,currencyDecimals), time:timeDiff, unit:currency})
        maxAmount = (_.maxBy(winners, 'amount')).amount
      }else{
        label = t('detail.opened',{number: `${winners.length}/${packetDetails.total_number}`, total:` ${ formateNumber(_.sumBy(winners, 'amount') ,currencyDecimals) }/ ${ formateNumber(packetDetails.total_amount ,currencyDecimals) } ${currency}`})
      }


      winners.forEach(
        (winner, i) =>{
          list.push( <div className="tb-row" key={'winner'+i}>
            <div className="tb-cell">
              <div className="detail__header text-secondary">{address.short(winner.address)}</div>
              <div className="detail__content text-grey">{moment(winner.confirmed_time*1000).format('LLL')}</div>
            </div>
            <div className="tb-cell  text-right">
              <div className="detail__header text-secondary">{ formateNumber( winner.amount ,currencyDecimals)} {currency}</div>
              <div className="detail__content text-grey">{!isNormalType && maxAmount && maxAmount===winner.amount && t('detail.luckiest')}</div>
            </div>
          </div>)
        }
      )
    }

    const senderAddress = address.short(packetDetails.sender_address)
    const alias = packetDetails.sender_address_name
    let yourRedPacket =  `${senderAddress}${t('qrCode.spacket')}`
    if(alias){
      yourRedPacket =  `${t('open.nickNameHint')} ${alias} ${t('qrCode.spacket')}`
    }

    return (
      <LogoContainer>
        <div className="shadow__mask">
          <div className="details__summary">
            <div>{!isNormalType && <img className="icon mr-1" src={require('../../img/icon/ping.png')} alt=""/>}{yourRedPacket}</div>
            {myRedPack && <div className="text-secondary amount_number red_amount"> { formateNumber(myRedPack.amount,currencyDecimals) }{currency}</div>}

            {myRedPack && <div>{ t('detail.saved', {unit:currency})}</div>}
            {packetDetails.sender_address === myAddress && <Link className="shared_button btn-primary" to={`/share/${this.props.match.params.id}`}>{t('detail.shared')}</Link>}
          </div>

          <div className="details__container">
            { list.length == 0? <div className="text-grey text-center noRecord">{t('common.noRecord')} </div>:[
              <div className="details__hint">{label}</div>,
              <div className="tb">
                { list }
              </div>
            ] }
          </div>
        </div>
      </LogoContainer>

    )
  }
}

const mapStateToProps = state => ({
  packetDetails: state.packetDetails,
  currency: state.currency && state.currency.toUpperCase()

})

const mapDispatchToProps = dispatch => ({
  getDetails: (redPackId) => dispatch(action.getRedpackDetails(redPackId)),
})

export default connect(mapStateToProps,mapDispatchToProps)( withTranslation()(RedPackDetails))
