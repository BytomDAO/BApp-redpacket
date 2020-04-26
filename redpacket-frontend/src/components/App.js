import React, { Component } from "react";
import '../styles/App.css';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router'
import Home from './layout/home'
import Send from './layout/send'
import Footer from './layout/addressFooter'
import Header from './layout/header'
import Share from './layout/share'
import QrCode from './layout/qrCode'
import Open from './layout/open'
import Details from './layout/details'
import Received from './layout/myReceived'
import MySent from './layout/mySent'
import NoMatch from './layout/noFound'
import bytomWrap from './layout/bytomWrap'
import Bytom from "bytom-js-sdk";
import action from './action'
import {connect} from "react-redux";
import bytomJs from 'bytom.js'
import {BTM} from './util/constants'

const networks = {
  solonet: 'http://app.bycoin.io:3000/',
  testnet: 'http://app.bycoin.io:3020/',
  mainnet: 'https://api.bycoin.im:8000/'
};

class App extends Component {
  constructor(props){
    super(props)
    global.bytomAPI = new Bytom(networks, '')
  }

  componentWillMount(){
    const { bytom, setBytom } = this.props;
    if(!bytom){
      document.addEventListener('chromeBytomLoaded', bytomExtension => {
        const bytom = window.bytom;
        window.bytomJs = new bytomJs(window.bytom.currentProvider ||'https://bcapi.bystack.com/')
        this.bytomLoaded(bytom);
        setBytom(bytom);
      });
    }else {
      this.bytomLoaded(bytom);
    }
  }

  async bytomLoaded (bytom){
    let bytomPollInterval = 3 * 1000;

    try {
      let BYTOM_ACCOUNT = await bytom.enable()

      this.props.updateConnection(true)

      global.bytomAPI.setNetType(bytom.net)

      // Check to see if the user has signed in/out of their
      // bytom wallet or switched accounts
      let accountInterval = setInterval(function () {
        if (BYTOM_ACCOUNT.address !== bytom.default_account.address) {
          location.reload(true);
        }

      }, bytomPollInterval);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return  (
            <Main />
    )
  }
}




const Main = () => (
  <Switch>
    <Route exact path='/' component={bytomWrap(Home)}/>
    <Route  path='/send' component={bytomWrap(Send)}/>
    <Route  path='/share/:id' component={bytomWrap(Share)}/>
    <Route  path='/qrCode/:id' component={QrCode}/>
    <Route  path='/open/:id' component={bytomWrap(Open)}/>
    <Route  path='/details/:id' component={bytomWrap(Details)}/>
    <Route  path='/myReceived' component={bytomWrap(Received)}/>
    <Route  path='/mySent' component={bytomWrap(MySent)}/>
    <Route component={bytomWrap(NoMatch)}/>
  </Switch>
);

const mapStateToProps = state => ({
  bytom: state.bytom,
})

const mapDispatchToProps = dispatch => ({
  setBytom: (bytom) => dispatch(action.setBytom(bytom)),
  updateConnection: (bytomConnection) => dispatch(action.updateConnection(bytomConnection)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
