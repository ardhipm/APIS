import {
    SET_OPEN_LOADING
} from '../../../Redux/actionTypes';

export const setOpenLoadingPopup = (open, message) => ({
    type: SET_OPEN_LOADING, 
    payload: {open, message}
})