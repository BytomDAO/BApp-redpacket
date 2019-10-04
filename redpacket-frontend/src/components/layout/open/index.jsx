import React from 'react'
import { open } from './action'
import { Formik, Form, Field } from 'formik';
import {Link } from 'react-router-dom'
import action from "../details/action";
import {connect} from "react-redux";
import address from '../../util/address'
import {withTranslation} from "react-i18next";
import LogoContainer from '../logoContainer'

require('./style.scss')

class Open extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      error:'',
      account: '',
    };
  }

  componentDidMount() {
    this.props.getDetails(this.props.match.params.id)
    const bytom = this.props.bytom
    if (
      bytom
      && bytom.default_account
    ) {
      this.setState({ account: bytom.default_account })
    }
  }

  componentWillUpdate(nextProps) {
    if(this.props.bytom !== nextProps.bytom){
      const bytom = nextProps.bytom
      if (
        bytom
        && bytom.default_account
      ) {
        this.setState({ account: bytom.default_account })
      }
    }
  }

  render() {
    const { t } = this.props;

    if(!this.props.packetDetails){
      return <div>{t('common.notFound')}</div>
    }
    const packetDetails = this.props.packetDetails

    const senderAddress = address.short(packetDetails.sender_address)
    const redPackId = this.props.match.params.id

    let winnerAddressArray = []
    if(packetDetails.winners && packetDetails.winners.length>0) {
      winnerAddressArray =  packetDetails.winners.map(winner => winner.address)
    }

    if(this.state.account &&  winnerAddressArray.includes(this.state.account.address)){
      this.props.history.push(`/details/${redPackId}`);
    }

    const finishState = packetDetails.total_number>0 && packetDetails.total_number === packetDetails.opened_number

    const Error = ({ name }) => (
      <Field
        name={name}
        render={({ form: { touched, errors } }) =>
          touched[name] && errors[name] ? <div className="error_hint"><span>{errors[name]}</span></div> : null
        }
      />
    );

    return (
      <LogoContainer>
        <div className="open__container redPacket__container">
          <div className="open__header">{packetDetails.note}</div>
          {senderAddress && <div className="open_hint">{senderAddress}{t('qrCode.spacket')}</div>}
          {!finishState &&<div><Formik
            initialValues={{password: ''}}
            validate={values => {
              let errors = {};
              if(!values.password){
                errors.password = t('open.require');
              } else if (values.password.length > 20) {
                errors.password =  t('common.passwordHint')
              }
              return errors;
            }}
            onSubmit={(values, {setSubmitting}) => {
              this.setState({
                error:'',
              })

              open(values,redPackId)
                .then((resp)=> {
                  switch (resp.data.status){
                    case 0:
                    case 2:
                      this.props.history.push(`/details/${redPackId}`);
                      break;

                    case 3:
                      throw t('open.codeError');
                      break;
                  }

                  setSubmitting(false)
                  this.setState({
                    error:'',
                  })
                }).catch(err => {
                  setSubmitting(false)
                  this.setState({
                    error:err,
                  })
              })
            }}
          >
            {(props) => (
                <Form>
                  <div className="open__input-box">
                    <Field className="open__password bg-white" type="text" name="password" placeholder={t('open.enterCode')}/>
                    <Error name="password" component="div"/>
                  </div>
                  <button className="open__button text-primary text-center" type="submit" disabled={props.isSubmitting}>
                    {t('open.open')}
                  </button>
                </Form>
            )}
          </Formik>

          </div>}
          {finishState &&<div>
            <div className="empty__box">{t('open.empty')}</div>
            <Link className="btn-primary back__home_btn" to={"/"}>{t('open.back')}</Link>
            </div>}

          {this.state.error && <div className="alert alert-danger mt-4" role="alert">
            {this.state.error}
          </div>}

        </div>
        <Link className="hr__hint" to={`/details/${redPackId}`}>{t('open.viewDetails')}</Link>
      </LogoContainer>
    )
  }
}
const mapStateToProps = state => ({
  packetDetails: state.packetDetails,
  bytom: state.bytom
})

const mapDispatchToProps = dispatch => ({
  getDetails: (redPackId) => dispatch(action.getRedpackDetails(redPackId)),
})

export default connect(mapStateToProps,mapDispatchToProps)(withTranslation()(Open))
