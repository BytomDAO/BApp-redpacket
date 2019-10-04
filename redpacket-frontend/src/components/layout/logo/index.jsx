import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

require('./style.scss')

const Logo = class extends Component {
  render () {

    return (
      <NavLink className="navbar-brand js-scroll-trigger mt-3" to="/">
        <img className="logo" src={require("../../../static/img/logo.png")} />
      </NavLink>
    )
  }
}

export default Logo
