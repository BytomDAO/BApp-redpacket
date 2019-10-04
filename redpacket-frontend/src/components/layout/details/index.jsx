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
    const { t } = this.props;

    if(!this.props.packetDetails){
      return <div></div>
    }

    const packetDetails = this.props.packetDetails
    const winners = packetDetails.winners

    const isNormalType = packetDetails.red_packet_type===0
    let myRedPack,label
    let list = []
    if(winners){

      myRedPack = winners.filter(winner => winner.address === window.bytom.default_account.address)[0]

      let maxAmount

      if(winners.length === packetDetails.total_number && winners.length > 0){
        const date1 = new Date(_.maxBy(winners, 'confirmed_time').confirmed_time * 1000)
        const date2 = new Date(packetDetails.send_time *1000)
        const timeDiff = timeDifference(date1, date2)
        label = t('detail.finished', {total:packetDetails.total_number, amount:packetDetails.total_amount/100000000, time:timeDiff})
        maxAmount = (_.maxBy(winners, 'amount')).amount
      }else{
        label = t('detail.opened',{number: `${winners.length}/${packetDetails.total_number}`, total:` ${_.sumBy(winners, 'amount') / 100000000}/ ${packetDetails.total_amount / 100000000} BTM`})
      }


      winners.forEach(
        (winner, i) =>{
          list.push( <div className="tb-row" key={'winner'+i}>
            <div className="tb-cell">
              <div className="detail__header text-secondary">{address.short(winner.address)}</div>
              <div className="detail__content text-grey">{winner.is_confirmed?new Date(winner.confirmed_time * 1000).toLocaleString():t('detail.confirming')}</div>
            </div>
            <div className="tb-cell  text-right">
              <div className="detail__header text-secondary">{winner.amount/100000000} BTM</div>
              <div className="detail__content text-grey">{!isNormalType && maxAmount && maxAmount===winner.amount && t('detail.luckiest')}</div>
            </div>
          </div>)
        }
      )
    }

    return (
      <LogoContainer>
        <div className="shadow__mask">
          <div className="details__summary">
            <h4 className="details__header text-secondary">{packetDetails.note} {!isNormalType && <img className="icon" src={require('../../../static/img/icon/ping.png')} alt=""/>}</h4>

            <div>{address.short(packetDetails.sender_address)}{t('qrCode.spacket')}</div>
            {myRedPack?<div className="text-secondary amount_number red_amount"> {myRedPack.amount/100000000}BTM</div>:<div className="text-secondary red_amount">{t('detail.notTaken')}</div>}

            {myRedPack && <div>{myRedPack.is_confirmed?t('detail.saved'):t('detail.confirming')}</div>}
            {packetDetails.sender_address === window.bytom.default_account.address && <Link className="shared_button btn-primary" to={`/share/${this.props.match.params.id}`}>{t('detail.shared')}</Link>}
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
})

const mapDispatchToProps = dispatch => ({
  getDetails: (redPackId) => dispatch(action.getRedpackDetails(redPackId)),
})

export default connect(mapStateToProps,mapDispatchToProps)( withTranslation()(RedPackDetails))
