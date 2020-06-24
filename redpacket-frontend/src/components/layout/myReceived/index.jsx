import React, {
  Component
} from 'react'
import { connect } from "react-redux"
import address from '../../util/address'
import action from "./action";
import {withTranslation} from "react-i18next";
import moment from 'moment';
import LogoContainer from '../logoContainer'
import Unit from "@/components/widget/unitDropdown";
import {IdMap, IdMapTest} from "@/components/util/constants";

class MyRecieved extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {currency, bytom} = this.props
    let assetId  = IdMap[currency]
    if(bytom.net === 'testnet' ||bytom.net === 'solonet'){
      assetId  = IdMapTest[currency]
    }

    if ( window.bytom ) {
      this.props.getMyReceived(assetId)
    }
  }
  componentWillUpdate(nextProps) {
    const {currency, bytom} = nextProps
    let assetId  = IdMap[currency]
    if(bytom.net === 'testnet' ||bytom.net === 'solonet'){
      assetId  = IdMapTest[currency]
    }

    if(this.props.currency !== nextProps.currency) {
      this.props.getMyReceived(assetId)
    }
  }

  render () {
    const { t, currency } = this.props;

    let totalAmount = 0
    let totalNumber = 0
    let list = []

    if(this.props.myReceivedDetails){

      const myReceivedDetails = this.props.myReceivedDetails
      const myReceivedList = myReceivedDetails.receiver_details

      totalNumber = myReceivedDetails.total_number
      totalAmount = myReceivedDetails.total_amount


      myReceivedList.forEach(
        (winner, i) =>{
          list.push( <div className="tb-row" key={'myReceived'+i}>
            <div className="tb-cell">
              <div className="detail__header text-secondary">{winner.sender_address_name||address.short(winner.sender_address)} {winner.red_packet_type === 1 && <img className="icon mb-1" src={require('../../img/icon/ping.png')} alt=""/>}</div>
              <div className="detail__content text-grey">{moment(winner.confirmed_time*1000).format('LLL')}</div>
            </div>
            <div className="tb-cell text-right">
              <div className="detail__header text-secondary">{winner.amount} {currency}</div>
              <div className="detail__content text-grey">{winner.note}</div>
            </div>
          </div>)
        }
      )
    }


    return (
      <LogoContainer>
        <div className="amount__container">
          <div className="d-inline-flex mx-auto">{t('myReceived.total')} <Unit/></div>
          <h4  className="text-secondary red_amount">{totalAmount}</h4>
          <div>{t('myReceived.receivedAmount',{amount:totalNumber})}</div>
        </div>

        <div className="details__container">
          <div className="tb">
            { list.length == 0? <div className="text-grey text-center noRecord">{t('common.noRecord')} </div>:list }
          </div>
        </div>
      </LogoContainer>
    )
  }
}

const mapStateToProps = state => {
  const myReceive = state.myReceivedDetails;
  const currency = state.currency && state.currency.toUpperCase()

  if(myReceive && myReceive.receiver_details){
    myReceive.receiver_details = myReceive.receiver_details.reverse()
  }
  return ({
    currency: currency,
    myReceivedDetails: myReceive
  })
}

const mapDispatchToProps = dispatch => ({
  getMyReceived: (assetId) => dispatch(action.getMyReceived(assetId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(MyRecieved))
