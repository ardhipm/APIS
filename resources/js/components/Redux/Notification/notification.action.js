import {
    GET_NOTIFICATION_ADMIN,
    GET_NOTIFICATION_ADMIN_SUCCESS,
    GET_NOTIFICATION_ADMIN_FAIL,
    GET_NOTIFICATION_USER,
    GET_NOTIFICATION_USER_SUCCESS,
    GET_NOTIFICATION_USER_FAIL,
    UPDATE_IS_READ,
    UPDATE_IS_READ_FAIL,
    UPDATE_IS_READ_SUCCESS

} from '../actionTypes';
import { api } from './notification.api';

export const getNotificationUser = () => async dispatch => {
    // console.log('getnotifpage');
    await dispatch({
        type: GET_NOTIFICATION_USER
    })

    const response = api.getUserNotification();
    response.then(
        response => { dispatch({type: GET_NOTIFICATION_USER_SUCCESS, payload: response}) },
        err => { dispatch({type: GET_NOTIFICATION_USER_FAIL, payload:err }) }
    )
}

export const readNotification = (notifId) => async dispatch => {
    // console.log('getnotifpage');
    await dispatch({
        type: UPDATE_IS_READ
    })

    const response = api.readNotification(notifId);
    response.then(
        async response => { 
            await dispatch({type: UPDATE_IS_READ_SUCCESS, payload: response}) 
            dispatch(getNotificationUser());
        },
        err => { dispatch({type: UPDATE_IS_READ_FAIL, payload:err }) }
    )
}