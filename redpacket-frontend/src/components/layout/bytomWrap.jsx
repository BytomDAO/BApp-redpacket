import React, { Component } from 'react'
import {connect} from "react-redux";
import Header from './header'
import {withTranslation} from "react-i18next";
import style from './style.scss'
import action from "@/components/layout/details/action";

// This is a Higher Order Component (HOC) that wraps up any components that require
// an unlocked Bytom account instance
export default function(WrappedComponent) {

  // ...and returns another component...
  const BytomWrap = class extends Component {
    componentDidMount() {
      const hash = this.props.location.hash
      let currency
      if(hash){
        currency = hash.replace('#','');
        this.props.updateCurrency(currency)
      }
    }

    render () {
      const { t } = this.props;

      let contents = <div />

      const Wrap = (content) => <div className="container__wrapper">
        <Header />
        <section className="portfolio" id="portfolio">
          <div className="container">
            {content}
          </div>
        </section>
        <input
          id='_copyInput'
          onChange={() => 'do nothing'}
          value='dummy'
          style={{display: 'none'}}
        />
      </div>

      const isVapor = (address='') => {
        const ab = address.substring(0,2)
        if(ab ==='vp' ||ab ==='tp' || ab ==='sp'){
          return true
        }else{
          return false
        }
      }

      const WrapWithBycoin = (content) => <div className="container__wrapper">
        <Header />
        <section className="portfolio" id="portfolio">
          <div className="container pt-4">
            <div className="shadow__mask">
              <div className="bycoin_wrapper__container outer__container">
                <div className="bycoin_wrapper__inner_container">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </section>
        <input
          id='_copyInput'
          onChange={() => 'do nothing'}
          value='dummy'
          style={{display: 'none'}}
        />
      </div>

      const bytom = this.props.bytom

      if(!bytom || !window.bytom){
        return <div className="d-flex vh-100 justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>

      }else if ((
          bytom
          && bytom.default_account
          && isVapor(bytom.default_account.address)
        ) || (
          bytom
          && bytom.defaultAccount
          && isVapor(bytom.defaultAccount.address)
        ) ){
        return Wrap(<WrappedComponent {...this.props} />)
      }else if (( bytom && !this.props.bytomConnection)) {
        return WrapWithBycoin(
          <div className="columns">
            <p className="text-white">
              {t('wrap.auth')}
            </p>
          </div>
        )
      } else if (( bytom && !isVapor(bytom.defaultAccount.address) )||( bytom && !isVapor(bytom.default_account.address) )) {
        return WrapWithBycoin(
          <div className="columns">
              <p className="text-white download_hint">
                {t('wrap.vaporOnlyHint')}
              </p>
          </div>
        )
      } else {
        return WrapWithBycoin(
          <div className="columns">
              <p className="text-white download_hint">
                {t('wrap.downloadHint')}
              </p>
              <a className="btn-primary download_btn ml-auto mr-auto" href="https://bycoin.im" target="_blank">{t('wrap.download')}</a>
          </div>
        )
      }

      return contents
    }

  }
  const mapStateToProps = state => ({
    bytom: state.bytom,
    bytomConnection: state.bytomConnection
  })

  const mapDispatchToProps = dispatch => ({
    updateCurrency: (currency) => dispatch({
      type: "UPDATE_CURRENCY",
      currency: currency
    }),
  })
  return connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BytomWrap))
}
