import 'jquery';
import 'popper.js';
import './styles/variable.scss'

import 'bootstrap/dist/js/bootstrap';
import "bootstrap/scss/bootstrap";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.js";
import { BrowserRouter } from 'react-router-dom';

import { Provider } from "react-redux";
import configureStore from "./store";

import {basename} from "./components/util/environment";

import './i18n';


require("babel-core/register");
require("babel-polyfill");

ReactDOM.render((
  <Provider store={configureStore()}>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));



