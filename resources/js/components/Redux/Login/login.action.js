import { api } from './login.api';
import { api as apiadmin } from '../../Api/api'
import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    IS_TOKEN_EXISTS,
    IS_TOKEN_EXISTS_SUCCESS,
    IS_TOKEN_EXISTS_FAIL,
    UPDATE_USER,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL
} from '../actionTypes';

export const login = (user, pass, rememberMe) => dispatch => {
    dispatch({
        type: LOGIN
    });
    const request = api.login(user, pass,rememberMe);
    return request.then(
        response => dispatch({type: LOGIN_SUCCESS, payload: response.data}),        
        err => {console.log('====> err ',err ); dispatch({type: LOGIN_FAIL, payload: err})}
    );
}

export const isTokenExists = () => dispatch => {
    const token = localStorage.getItem("authToken")
    dispatch({
        type: IS_TOKEN_EXISTS,
        payload: token !== null && token.length > 0
    })
}

export const updateUser = () => dispatch => {
    dispatch({
        type: GET_CUSTOMER_VIEW
    })
    const request = apiadmin.getCustomers();
    return request.then(
        response => dispatch({type: UPDATE_USER_SUCCESS, payload: response.data}),        
        err => dispatch({type: UPDATE_USER_FAIL, payload: err})
    );
}