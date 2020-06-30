import rotateReducer from "./reducers/rotateReducer"
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

function configureStore(state =
                          {
                            packetDetails: '',
                            myReceivedDetails:'',
                            mySentDetails:'',
                            bytom:'',
                            bytomConnection:false,
                            currency:'BTM',
                            assetsList:[],
                            loading:true
                          }) {
  return createStore(
    rotateReducer,
    state,
    compose(
      applyMiddleware(
        thunkMiddleware,
      ),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )
}
export default configureStore