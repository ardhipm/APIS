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


const initialState = {
    notifications: [],
    newNotif: false
}


const notifReducer = (state = initialState, action) => {

    // console.log(action);
    switch (action.type) {
        case GET_NOTIFICATION_USER:
            return {
                ...state,
                // notifications: action.payload.data,
                // newNotif: action.payload.message,
            }
        case GET_NOTIFICATION_USER_SUCCESS:
            let isNewElement = action.payload.data.data.filter(element => element.is_read ==0);
            
            return {
                ...state,
                notifications: [...action.payload.data.data],
                newNotif: isNewElement.length > 0,
            };
        case GET_NOTIFICATION_USER_FAIL:
            return {
                ...state,
            };
        case UPDATE_IS_READ:
            return {
                ...state,
            };
        case UPDATE_IS_READ_SUCCESS:
            return {
                ...state,
            };
        case UPDATE_IS_READ_FAIL:
            return {
                ...state
            }
        default:
            return state
    }
}

export default notifReducer;