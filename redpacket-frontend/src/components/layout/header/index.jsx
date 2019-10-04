import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { withTranslation } from 'react-i18next';
import moment from 'moment';

require('./style.scss')

const Header = class extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    const { t, i18n} = this.props;
    const currentLng = i18n.language

    const changeLanguage = () => {
      if(currentLng == 'zh-CN'){
        i18n.changeLanguage('en');
        moment.locale('en');
      }else{
        i18n.changeLanguage('zh-CN');
        moment.locale('zh-CN');
      }
    };


    return (
      <nav className="navbar fixed-top text-uppercase" id="mainNav">
        <div className="container">
          <button className="navbar-toggler ml-auto" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <img className="ham" src={require("../../../static/img/icon/menu.png")} />
          </button>

          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav float-right text-center mr-auto nav__container bg-white">
              <li className="nav-item mx-0 mx-lg-1">
                <NavLink  exact activeClassName="active" className="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" to='/'>{t('main.home')}</NavLink>
              </li>
              <li className="nav-item mx-0 mx-lg-1">
                <NavLink  exact activeClassName="active" className="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger"  to='/myReceived'>{t('main.myReceived')}</NavLink>
              </li>
              <li className="nav-item mx-0 mx-lg-1">
                <NavLink  exact activeClassName="active" className="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger"  to='/mySent'>{t('main.mySent')}</NavLink>
              </li>
              <li className="nav-item mx-0 mx-lg-1">
                <button className="btn btn-link text-secondary" onClick={() => changeLanguage()}>{currentLng==='en'?'中文':'English'}</button>
              </li>
            </ul>
          </div>

        </div>
      </nav>
    )
  }
}

export default withTranslation()(Header)
