import {
    SET_YESNO_DIALOG
} from '../../../actionTypes';

export const confirmDialogType = {
    DELETE_CHOICE_PHOTO_AFTER_CHECKOUT : 'DELETE_CHOICE_PHOTO_AFTER_CHECKOUT',
    CHECKOUT_SELECTED_PHOTO: 'CHECKOUT_SELECTED_PHOTO',
    CHECKOUT_ALBUM_PRINT_PHOTO: 'CHECKOUT_ALBUM_PRINT_PHOTO',
    INDEX_ORIGIN_PHOTO: 'INDEX_ORIGIN_PHOTO',
    INDEX_CHOICE_PHOTO: 'INDEX_CHOICE_PHOTO'
}

export const setOpenConfirmDialog = (open, message, type = null) => async dispatch => {
    dispatch({type: SET_YESNO_DIALOG, payload: {open, message, type}})
}