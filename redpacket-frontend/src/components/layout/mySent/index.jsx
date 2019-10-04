import React, {
  Component
} from 'react'
import { connect } from "react-redux"
import action from "./action";
import {Link } from 'react-router-dom'
import {withTranslation} from "react-i18next";
import moment from 'moment';
import LogoContainer from '../logoContainer'

require('./style.scss')

class MySent extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if ( window.bytom ) {
      this.props.getMySent()
    }
  }

  render () {
    const { t } = this.props;

    let totalAmount = 0
    let totalNumber = 0
    let list = []

    if(this.props.mySentDetails){

      const mySentDetails = this.props.mySentDetails
      const mySentList = mySentDetails.sender_details

      totalNumber = mySentDetails.total_number
      totalAmount = mySentDetails.total_amount/100000000

      mySentList.forEach(
        (winner, i) =>{
          list.push(<Link className="tb-row" key={'mySent'+i} to={`/details/${winner.red_packet_id}`}>
            <div className="tb-cell">
              <div className="detail__header text-secondary">{winner.red_packet_type === 1 ? t('mySent.random'):t('mySent.normal')}</div>
              <div className="detail__content text-grey">{winner.is_confirmed?moment(winner.send_time*1000).format('LLL'):t('detail.confirming')}</div>
            </div>
            <div className="tb-cell text-right">
              <div className="detail__header text-secondary">{winner.total_amount/100000000} BTM</div>
              <div className="detail__content text-grey">{t('mySent.noneAvailable')} {winner.opened_number}/{winner.total_number}</div>
            </div>
          </Link>)
        }
      )
    }


    return (
      <LogoContainer>
        <div className="amount__container">
          <div>{t('mySent.total')}</div>
          <h4 className="text-secondary red_amount">{totalAmount}</h4>
          <div>{t('mySent.sentAmount',{amount:totalNumber})}</div>
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
  const mySent = state.mySentDetails;
  if(mySent && mySent.sender_details){
    mySent.sender_details = mySent.sender_details.reverse()
  }
  return ({
    mySentDetails: mySent
  })
}


const mapDispatchToProps = dispatch => ({
  getMySent: () => dispatch(action.getMySent()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(MySent))
