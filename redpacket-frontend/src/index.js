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

window.onload = function() {
  let lastTouchEnd = 0;
  document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  });
  document.addEventListener('touchend', function(event) {
    let now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  document.addEventListener('gesturestart', function(event) {
    event.preventDefault();
  });
  document.addEventListener('dblclick', function (event) {
    event.preventDefault();
  })
}

ReactDOM.render((
  <Provider store={configureStore()}>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));



