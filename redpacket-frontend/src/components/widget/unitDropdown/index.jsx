import React from 'react'
import {withTranslation} from "react-i18next";
import {Dropdown } from 'react-bootstrap';
import {connect} from "react-redux";

require('./style.scss')

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className={'text-body pl-2 pr-2'}
  >
    {children}
    <div className="arrow"/>
  </a>
));


class Unit extends React.Component {
  render() {

    const { currency, updateCurrency} = this.props;
    return (
      <Dropdown
        id='dropdown-custom-1'
        bsSize='xsmall'
        onSelect={updateCurrency}
        alignRight
      >
        <Dropdown.Toggle
          as={CustomToggle}
        >
          {(currency||'').toUpperCase()}
        </Dropdown.Toggle>
        <Dropdown.Menu
          className="dropdown-menu"
        >
          <Dropdown.Item eventKey="BTM">BTM</Dropdown.Item>
          {/*<Dropdown.Item eventKey="DAI">DAI</Dropdown.Item>*/}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

const mapStateToProps = state => ({
  currency: state.currency,
})

const mapDispatchToProps = dispatch => ({
  updateCurrency: (currency) => dispatch({
    type: "UPDATE_CURRENCY",
    currency: currency
  }),
})

export default connect(mapStateToProps,mapDispatchToProps)(withTranslation()(Unit));
