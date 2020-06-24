import React from 'react'
import { sendRedPack } from './action'
import { Formik, Form, Field } from 'formik';
import {withTranslation} from "react-i18next";
import LogoContainer from '../logoContainer'
import Footer from '../addressFooter'

import { Alert } from 'react-bootstrap';
import {connect} from "react-redux";

import Unit from "@/components/widget/unitDropdown";
require('./style.scss')

class Send extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type:'advanced',
      error:''
    };

    this.changeToNormal = this.changeToNormal.bind(this)
  }

  changeToNormal(e, handleReset, type){
    e.preventDefault()
    this.setState({
      type: type,
      error:''
    })
    handleReset()
  }

  render() {

    const { t, i18n, currency} = this.props;

    const lng = i18n.language

    const Error = ({ name }) => (
      <Field
        name={name}
        render={({ form: { touched, errors } }) =>
          touched[name] && errors[name] ? <div className="form__error_hint"><span>{errors[name]}</span></div> : null
        }
      />
    );

    return (
      <LogoContainer>
        <div key="sendBlock" className="send__background">
          <Formik
            initialValues={{amount: '', number: '', password: '', alias: ''}}
            validate={values => {
              let errors = {};
              if (!values.amount) {
                errors.amount = t('common.require');
              } else if (values.amount < 0.01) {
                errors.amount = t('send.amountMinHint', {unit:currency});
              } else if (this.state.type ==='advanced' && values.amount < 0.01 * values.number) {
                errors.amount = t('send.amountMultipleMinHint' , {unit:currency});
              } else if (
                !/^(\d*\.)?\d+$/i.test(values.amount)
              ) {
                errors.amount = t('send.amountHint')
              }

              if (!values.number) {
                errors.number = t('common.require');
              } else if (!/^[1-9]\d*$/i.test(values.number)) {
                errors.number = t('send.numberHint');
              }

              if(!values.password) {
                errors.password = t('common.require');
              } else if (!/^[ A-Za-z0-9\u3000\u3400-\u4DBF\u4E00-\u9FFF]*$/.test(values.password)) {
                errors.password = t('common.passwordTypeHint')
              } else {
                const hanArray = (values.password.match(/[\u3000\u3400-\u4DBF\u4E00-\u9FFF]+/g) || []).join('')
                if(hanArray.length> 6){
                  errors.password = t('send.passwordZhHint')
                }else if((hanArray.length*3 + (values.password.length-hanArray.length)) > 20 ){
                  errors.password = t('send.passwordEnHint')
                }
              }

              if(values.alias) {
                if (!/^[ A-Za-z0-9\u3000\u3400-\u4DBF\u4E00-\u9FFF]*$/.test(values.alias)) {
                  errors.alias = t('send.aliasTypeHint')
                } else {
                  const hanArray = (values.alias.match(/[\u3000\u3400-\u4DBF\u4E00-\u9FFF]+/g) || []).join('')
                  if (hanArray.length > 6) {
                    errors.alias = t('send.aliasZhHint')
                  } else if ((hanArray.length * 3 + (values.alias.length - hanArray.length)) > 20) {
                    errors.alias = t('send.aliasEnHint')
                  }
                }
              }

              return errors;
            }}
            onSubmit={(values, {setSubmitting}) => {

              values.currency = currency
              this.setState({
                error:'',
              })

              sendRedPack(values,(this.state.type === 'normal'))
                .then((redPackId)=> {
                  setSubmitting(false)
                  this.props.history.push(`/share/${redPackId}/#${currency}`)
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
              <div>
                <div className="text-center mb-3">
                  <button className={`btn btn-link link__btn ${this.state.type !=='advanced' && 'inactive'}`} onClick={(e)=>this.changeToNormal(e, props.handleReset,'advanced')}>
                    <img className="icon" src={require('../../img/icon/ping-outline.png')} alt=""/> {t('send.random')}
                  </button>
                  <div className="vertical_separator"/>
                  <button className={`btn btn-link link__btn ${this.state.type ==='advanced' && 'inactive'}`} onClick={(e)=>this.changeToNormal(e, props.handleReset, 'normal')}>
                    <img className="icon" src={require('../../img/icon/packet.png')} alt=""/> {t('send.normal')}
                  </button>
                </div>
                <Form>
                  <div className="form-group">
                    <div className="input-box">
                      <label htmlFor="amount">{this.state.type ==='advanced'? t('send.total') : t('send.single')}
                      </label>
                      <Field type="text" name="amount" placeholder='0.00'/>
                      <Unit/>

                    </div>
                    <Error name="amount" component="div"/>
                  </div>


                  <div className="form-group">
                    <div className="input-box">
                      <label htmlFor="number">{t('send.quantity')}</label>
                      <Field
                        type="number"
                        name="number"
                        placeholder={t('send.enterNo')}
                        min='1'
                      />{lng ==='zh-CN' && <span className="unit">个</span>}
                    </div>
                    <Error name="number" component="div"/>
                  </div>

                  <div className="form-group">
                    <div className="input-box">
                      <label htmlFor="password">{t('send.code')}</label>
                      <Field type="text" name="password" placeholder={t('send.enterCode')}/>
                    </div>
                    <div className="hint text-white">{t('send.codeHint')}</div>
                    <Error name="password" component="div"/>
                  </div>


                  <div className="form-group">
                    <div className="input-box">
                      <label htmlFor="word">{t('send.alias')} </label>
                      <Field type="text" name="alias" placeholder={t('send.aliasPlaceHolder')}/>
                    </div>
                    <Error name="alias" component="div"/>
                  </div>


                  <button className="btn-primary w-100 mt-4" type="submit" disabled={props.isSubmitting}>
                    {t('send.send')}
                  </button>
                </Form>
              </div>
            )}
          </Formik>

          {this.state.error && <Alert className='mt-4' variant="danger" onClose={() => this.setState({ error: '' })} dismissible>
            {this.state.error}
          </Alert>}
        </div>

        <Footer/>
      </LogoContainer>
    );
  }
}

const mapStateToProps = state => ({
  currency: state.currency,
})


export default connect(mapStateToProps)(withTranslation()(Send));
