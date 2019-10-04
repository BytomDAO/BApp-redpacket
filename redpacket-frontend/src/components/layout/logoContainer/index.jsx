import React, { Component } from 'react'
import Logo from '../logo'

const LogoContainer = class extends Component {
  render () {

    return (
      <div className="container">
        <Logo/>
        <div className="outer__container">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default LogoContainer
