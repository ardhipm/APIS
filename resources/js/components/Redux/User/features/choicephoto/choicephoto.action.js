import { api } from './choicephoto.api';
import {
    UPDATE_SUBPACKAGE_IDX,
    GET_CHOICE_PHOTO_METADATA,
    GET_CHOICE_PHOTO_METADATA_SUCCESS,
    GET_CHOICE_PHOTO_METADATA_FAIL,
    GET_CHOICE_PHOTO_WITH_PAGINATION,
    GET_CHOICE_PHOTO_WITH_PAGINATION_SUCCESS,
    GET_CHOICE_PHOTO_WITH_PAGINATION_FAIL,
    RESET_CHOICE_PHOTO,
    UPDATE_PAGE_NUMBER,
    UPDATE_CURRENT_PREVIEW_PHOTO,
    OPEN_CHOICE_PHOTO_PREVIEW,
    SELECT_ALBUM_PHOTO,
    SELECT_ALBUM_PHOTO_SUCCESS,
    SELECT_ALBUM_PHOTO_FAIL,
    SELECT_PRINT_PHOTO,
    SELECT_PRINT_PHOTO_SUCCESS,
    SELECT_PRINT_PHOTO_FAIL,
    DELETE_ALBUM_PHOTO,
    DELETE_ALBUM_PHOTO_SUCCESS,
    DELETE_ALBUM_PHOTO_FAIL,
    DELETE_PRINT_PHOTO,
    DELETE_PRINT_PHOTO_SUCCESS,
    DELETE_PRINT_PHOTO_FAIL,
    UPDATE_TOTAL_SELECTED_ALBUM,
    UPDATE_TOTAL_SELECTED_ALBUM_SUCCESS,
    UPDATE_TOTAL_SELECTED_ALBUM_FAIL,
    UPDATE_TOTAL_SELECTED_PRINT,
    UPDATE_TOTAL_SELECTED_PRINT_SUCCESS,
    UPDATE_TOTAL_SELECTED_PRINT_FAIL,
    CHECKOUT_ALBUM_PRINT_PHOTO, 
    CHECKOUT_ALBUM_PRINT_PHOTO_SUCCESS,
    CHECKOUT_ALBUM_PRINT_PHOTO_FAIL
} from '../../../actionTypes';
import { setOpenLoadingPopup } from '../../../Popup/Loading/loading.action';
import { setOpenAlertPopup } from '../../../Popup/Alert/alert.action';

export const getChoicePhotoMetadata = () => async dispatch => {
    await dispatch({
        type: GET_CHOICE_PHOTO_METADATA
    })

    const response = api.getChoicePhotoMetadata();
    response.then(
        response => { dispatch({type: GET_CHOICE_PHOTO_METADATA_SUCCESS, payload: response.data}) },
        err => { dispatch({type: GET_CHOICE_PHOTO_METADATA_FAIL, payload:err }) }
    )
}

export const getChoicePhotoWithPagination = (subpackageId, page) => async dispatch => {
    await dispatch({
        type: GET_CHOICE_PHOTO_WITH_PAGINATION
    })

    const response = api.getChoicePhotoWithPagination(subpackageId, page);
    response.then(
        response => { dispatch({type: GET_CHOICE_PHOTO_WITH_PAGINATION_SUCCESS, payload: response}) },
        err => { dispatch({type: GET_CHOICE_PHOTO_WITH_PAGINATION_FAIL, payload:err }) }
    )
}

export const updateSubpackageIdx = (idx) => dispatch =>{
    dispatch({
        type: UPDATE_SUBPACKAGE_IDX,
        payload: idx
    })
}

export const resetChoicePhoto = () => ({
    type: RESET_CHOICE_PHOTO
})

export const updatePageNumber = (pageNumber) => ({
    type: UPDATE_PAGE_NUMBER,
    payload: pageNumber
})

export const updateCurrentPreviewPhoto = (basename) => ({
    type: UPDATE_CURRENT_PREVIEW_PHOTO,
    payload: basename
})

export const openPicturePreview = (show) => ({
    type: OPEN_CHOICE_PHOTO_PREVIEW,
    payload: show
})

export const addSelectAlbumPhoto = (basename, subpackageId) => async (dispatch, getState) => {
    await dispatch({
        type: SELECT_ALBUM_PHOTO
    })
    const response = api.selectAlbumPhoto(basename, subpackageId);
    return  response.then(
        async response => {
            dispatch({type: SELECT_ALBUM_PHOTO_SUCCESS, payload: response.data})
            await dispatch(resetChoicePhoto());
            dispatch(getChoicePhotoWithPagination(getState().choicePhotoReducer.selectedSubPackageIdx, 1));
            dispatch(countSelectedAlbumPhoto());
        },        
        err => dispatch({type: SELECT_ALBUM_PHOTO_FAIL, payload: err})   
    )
}

export const addSelectPrintPhoto = (basename, subpackageId) => async (dispatch, getState) => {
    await dispatch({
        type: SELECT_PRINT_PHOTO
    })
    const response = api.selectPrintPhoto(basename, subpackageId);
    return  response.then(
        async response => {
            dispatch({type: SELECT_PRINT_PHOTO_SUCCESS, payload: response.data})
            await dispatch(resetChoicePhoto());
            dispatch(getChoicePhotoWithPagination(getState().choicePhotoReducer.selectedSubPackageIdx, 1));
            dispatch(countSelectedPrintPhoto());
        },
        err => dispatch({type: SELECT_PRINT_PHOTO_FAIL, payload: err})   
    )
}

export const deleteSelectAlbumPhoto = (basename, subpackageId) => async (dispatch, getState) => {
    await dispatch({
        type: DELETE_ALBUM_PHOTO, 
    })
    const response = api.deleteAlbumPhoto(basename, subpackageId);
    return  response.then(
        async response => {
            dispatch({type: DELETE_ALBUM_PHOTO_SUCCESS, payload: response.data})
            await dispatch(resetChoicePhoto());
            dispatch(getChoicePhotoWithPagination(getState().choicePhotoReducer.selectedSubPackageIdx, 1));
            dispatch(countSelectedAlbumPhoto());
        },
        err => dispatch({type: DELETE_ALBUM_PHOTO_FAIL, payload: err})   
    )
}

export const deleteSelectPrintPhoto = (basename, subpackageId) => async (dispatch, getState) => {
    await dispatch({
        type: DELETE_PRINT_PHOTO
    })
    const response = api.deletePrintPhoto(basename, subpackageId);
    return  response.then(
        async response => {
            dispatch({type: DELETE_PRINT_PHOTO_SUCCESS, payload: response.data})
            await dispatch(resetChoicePhoto());
            dispatch(getChoicePhotoWithPagination(getState().choicePhotoReducer.selectedSubPackageIdx, 1));
            dispatch(countSelectedPrintPhoto());
        },        
        err => dispatch({type: DELETE_PRINT_PHOTO_FAIL, payload: err})   
    )
}

export const countSelectedAlbumPhoto = () => async dispatch => {
    await dispatch({
        type: UPDATE_TOTAL_SELECTED_ALBUM
    })

    const response = api.countSelectedAlbumPhoto();
    return response.then(
        response => dispatch({type: UPDATE_TOTAL_SELECTED_ALBUM_SUCCESS, payload: response.data}),
        err => dispatch({type: UPDATE_TOTAL_SELECTED_ALBUM_FAIL, payload: err})
    )
}

export const countSelectedPrintPhoto = () => async dispatch => {
    await dispatch({
        type: UPDATE_TOTAL_SELECTED_PRINT
    })

    const response = api.countSelectedPrintPhoto();
    return response.then(
        response => dispatch({type: UPDATE_TOTAL_SELECTED_PRINT_SUCCESS, payload: response.data}),
        err => dispatch({type: UPDATE_TOTAL_SELECTED_PRINT_FAIL, payload: err})
    )
}

export const checkoutAlbumPrintPhoto = () => async dispatch => {
    dispatch(setOpenLoadingPopup(true, 'Loading...'));
    await dispatch({
        type: CHECKOUT_ALBUM_PRINT_PHOTO
    })

    const response = api.checkoutAlbumPrintPhoto();
    return response.then(
        response => {

            dispatch(setOpenLoadingPopup(false, ''));
            dispatch(setOpenAlertPopup(true, 'Berhasil memilih foto album dan print', 'success'));
            dispatch({type: CHECKOUT_ALBUM_PRINT_PHOTO_SUCCESS, payload: response})
            
        },
        err => {
            dispatch(setOpenLoadingPopup(false, ''));
            dispatch(setOpenAlertPopup(true, 'Gagal memilih foto album dan print', 'error'));
            dispatch({type: CHECKOUT_ALBUM_PRINT_PHOTO_FAIL, payload: err})
        }
    )
}