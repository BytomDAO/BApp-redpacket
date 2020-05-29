import React from 'react'
import {Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next';

require('./style.scss')

class Home extends React.Component {

  render() {
    const { t } = this.props;

    return (
      <div className="container pt-4">
        <div className="home__container outer__container">
          <div className="home__bottom_container">
            <Link className="btn-primary send_btn ml-auto mr-auto mb-2" to="/send">{t('main.sendPacket')}</Link>

            <div className="text-center mb-3">
              <Link className="btn link__btn" to="/mySent"><img className="icon mr-2"  src={require("../../img/icon/send.png")} alt=""/>{t('main.mySent')}</Link>
              <div className="vertical_separator"/>
              <Link className="btn link__btn" to="/myReceived"><img className="icon mr-2" src={require("../../img/icon/receive.png")} alt=""/>{t('main.myReceived')}</Link>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default withTranslation()(Home)
