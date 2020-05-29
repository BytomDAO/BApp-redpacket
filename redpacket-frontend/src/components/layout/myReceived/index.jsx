import React, {
  Component
} from 'react'
import { connect } from "react-redux"
import address from '../../util/address'
import action from "./action";
import {withTranslation} from "react-i18next";
import moment from 'moment';
import LogoContainer from '../logoContainer'


class MyRecieved extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if ( window.bytom ) {
      this.props.getMyReceived()
    }
  }

  render () {
    const { t } = this.props;

    let totalAmount = 0
    let totalNumber = 0
    let list = []

    if(this.props.myReceivedDetails){

      const myReceivedDetails = this.props.myReceivedDetails
      const myReceivedList = myReceivedDetails.receiver_details

      totalNumber = myReceivedDetails.total_number
      totalAmount = myReceivedDetails.total_amount/100000000


      myReceivedList.forEach(
        (winner, i) =>{
          list.push( <div className="tb-row" key={'myReceived'+i}>
            <div className="tb-cell">
              <div className="detail__header text-secondary">{address.short(winner.sender_address)} {winner.red_packet_type === 1 && <img className="icon" src={require('../../img/icon/ping.png')} alt=""/>}</div>
              <div className="detail__content text-grey">{moment(winner.confirmed_time*1000).format('LLL')}</div>
            </div>
            <div className="tb-cell text-right">
              <div className="detail__header text-secondary">{winner.amount/100000000} BTM</div>
              <div className="detail__content text-grey">{winner.note}</div>
            </div>
          </div>)
        }
      )
    }


    return (
      <LogoContainer>
        <div className="amount__container">
          <div>{t('myReceived.total')}</div>
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
  if(myReceive && myReceive.receiver_details){
    myReceive.receiver_details = myReceive.receiver_details.reverse()
  }
  return ({
    myReceivedDetails: myReceive
  })
}

const mapDispatchToProps = dispatch => ({
  getMyReceived: () => dispatch(action.getMyReceived()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(MyRecieved))
