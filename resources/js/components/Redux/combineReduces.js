import {combineReducers} from 'redux';
import { connectRouter } from 'connected-react-router'
import admin from './Admin/reducer'

const createRootReducer = (history) => (combineReducers({
    router: connectRouter(history),
    admin,
}));

export default createRootReducer;