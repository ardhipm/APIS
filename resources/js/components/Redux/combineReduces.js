import {combineReducers} from 'redux';
import { connectRouter } from 'connected-react-router'
import admin from './Admin/reducer'
import originphoto from './User/features/originphoto/reducer'

const createRootReducer = (history) => (combineReducers({
    router: connectRouter(history),
    admin,
    originphoto
    
}));

export default createRootReducer;