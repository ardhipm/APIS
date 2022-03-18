import {
    OPEN_ALERT    
} from '../../actionTypes';

export const setOpenAlertPopup = (open, message, type) => async dispatch => {
    dispatch({type: OPEN_ALERT, payload: {open, message, type}})
}