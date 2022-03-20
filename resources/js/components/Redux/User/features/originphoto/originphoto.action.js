
import { api } from './originphoto.api';
import {
    GET_ORIGIN_PHOTO,
    GET_ORIGIN_PHOTO_SUCCESS,
    GET_ORIGIN_PHOTO_FAIL,
    GET_ORIGIN_PHOTO_WITH_PAGINATION,
    GET_ORIGIN_PHOTO_WITH_PAGINATION_SUCCESS,
    GET_ORIGIN_PHOTO_WITH_PAGINATION_FAIL,
    GET_ORIGIN_PHOTO_METADATA, 
    GET_ORIGIN_PHOTO_METADATA_SUCCESS, 
    GET_ORIGIN_PHOTO_METADATA_FAIL, 
    UPDATE_SUBPACKAGE_IDX,
    GET_SUBPACKAGE,
    GET_SUBPACKAGE_SUCCESS,
    GET_SUBPACKAGE_FAIL,
    RESET_ORIGIN_PHOTO,
    ORIGIN_SELECTED_PHOTO, 
    ORIGIN_SELECTED_PHOTO_SUCCESS,
    ORIGIN_SELECTED_PHOTO_FAIL,
    ORIGIN_DELETE_PHOTO, 
    ORIGIN_DELETE_PHOTO_SUCCESS,
    ORIGIN_DELETE_PHOTO_FAIL,
    UPDATE_PAGE_NUMBER,
    GET_COUNT_SELECTED_PHOTO,
    GET_COUNT_SELECTED_PHOTO_SUCCESS,
    GET_COUNT_SELECTED_PHOTO_FAIL,
    UPDATE_SELECTED_ORIGIN_PHOTO,
    UPDATE_CURRENT_PREVIEW_PHOTO,
    OPEN_ORIGIN_PHOTO_PREVIEW,
    CHECKOUT_SELECTED_PHOTO,
    CHECKOUT_SELECTED_PHOTO_SUCCESS,
    CHECKOUT_SELECTED_PHOTO_FAIL,
    GET_DOWNLOAD_LINK, 
    GET_DOWNLOAD_LINK_SUCESS,
    GET_DOWNLOAD_LINK_FAIL,
    SET_OPEN_DOWNLOAD_POPUP
} from '../../../actionTypes'
import { setOpenLoadingPopup } from '../../../Popup/Loading/loading.action';
import { setOpenAlertPopup } from '../../../Popup/Alert/alert.action';


export const getOriginPhoto = (page) => dispatch => {
    dispatch({
        type: GET_ORIGIN_PHOTO
    });
    const request = api.getOriginPhoto(page);

    return request.then(
        response => dispatch({type: GET_ORIGIN_PHOTO_SUCCESS, payload: response}),        
        err => dispatch({type: GET_ORIGIN_PHOTO_FAIL, payload: err})
    );
    
};

export const getOriginPhotoWithPagination =  (kategori, page) => async dispatch => {
    await dispatch({
        type: GET_ORIGIN_PHOTO_WITH_PAGINATION
    });

    const request = api.getOriginPhotoWithPagination(kategori, page);

    return request.then(
        response => dispatch({type: GET_ORIGIN_PHOTO_WITH_PAGINATION_SUCCESS, payload: response}),        
        err => dispatch({type: GET_ORIGIN_PHOTO_WITH_PAGINATION_FAIL, payload: err})
    );
    
};

export const getOriginPhotoMetadata = () => async dispatch => {
    await dispatch({
        type: GET_ORIGIN_PHOTO_METADATA, 
    });

    const request = api.getOriginPhotoMetadata();
    
    return request.then(
        response => dispatch({type: GET_ORIGIN_PHOTO_METADATA_SUCCESS, payload: response.data}),        
        err => dispatch({type: GET_ORIGIN_PHOTO_METADATA_FAIL, payload: err})   
    )

}

export const updateSubpackageIdx = (idx) => dispatch =>{
    dispatch({
        type: UPDATE_SUBPACKAGE_IDX,
        payload: idx
    })

    dispatch(getSubpackage(idx));

    
}

export const getSubpackage = (id) => async dispatch =>{
    await dispatch({
        type: GET_SUBPACKAGE,
    })

    const response =  api.getSubpackage(id);

    return response.then(
        response => dispatch({type: GET_SUBPACKAGE_SUCCESS, payload: response.data}),        
        err => dispatch({type: GET_SUBPACKAGE_FAIL, payload: err})   
    )
}

export const resetOriginPhoto = () => ({
  type: RESET_ORIGIN_PHOTO  
})

export const addSelectedPhoto = (basename, subpackageId) => async (dispatch, getState) => {
    // console.log(getState().originPhotoReducer);

    // return;
    // const selector = useSelector(getState());
    dispatch(setOpenLoadingPopup(true, 'Loading...'));
    await dispatch({
        type: ORIGIN_SELECTED_PHOTO
    })

    const response = api.selectOriginPhoto(basename, subpackageId);

    return  response.then(
        async response => {
            dispatch(setOpenLoadingPopup(false, ''));
            dispatch({type: ORIGIN_SELECTED_PHOTO_SUCCESS, payload: response.data})
            await dispatch(resetOriginPhoto());
            dispatch(getOriginPhotoWithPagination(getState().originPhotoReducer.selectedSubPackageIdx, 1));
        },        
        err => {
            
            dispatch({type: ORIGIN_SELECTED_PHOTO_FAIL, payload: err})}   
    )
}

export const removeSelectedPhoto = (basename) => async (dispatch, getState) => {

    // const selector = useSelector(getState());
    dispatch(setOpenLoadingPopup(true, 'Loading'));
    await dispatch({
        type: ORIGIN_DELETE_PHOTO
    })

    const response = api.removeSelectedOriginPhoto(basename);

    return response.then(
        async response => {
            dispatch(setOpenLoadingPopup(false, ''));
            dispatch({type: ORIGIN_DELETE_PHOTO_SUCCESS, payload: response.data})
            if(response.data.success){
                await dispatch(setOpenAlertPopup(true, 'Hapus foto berhasil', 'success'));
                console.log('hapus berhasil');
            }else{
                await dispatch(setOpenAlertPopup(true, 'Hapus foto gagal, foto sedang dalam pengeditan', 'error'));
                console.log('hapus gagl')
            }
            
            await dispatch(resetOriginPhoto());
            dispatch(getOriginPhotoWithPagination(getState().originPhotoReducer.selectedSubPackageIdx, 1));
        },
        err => {
            dispatch(setOpenLoadingPopup(false, ''));
            dispatch({type: ORIGIN_DELETE_PHOTO_FAIL, payload: err})
            dispatch(setOpenAlertPopup(true, 'Hapus foto gagal', 'error'))
        }    
    )
}

export const updatePageNumber = (pageNumber) => ({
    type: UPDATE_PAGE_NUMBER,
    payload: pageNumber
})

export const countSelectedOriginPhoto = (subPackageId) => async dispatch => {
    if(subPackageId < 0){
        return;
    }
    dispatch({
        type: GET_COUNT_SELECTED_PHOTO
    })

    const response = api.countSelectedOriginPhoto(subPackageId);

    return response.then(
        response => dispatch({type: GET_COUNT_SELECTED_PHOTO_SUCCESS, payload: response.data}),        
        err => dispatch({type: GET_COUNT_SELECTED_PHOTO_FAIL, payload: err})   
    )
};

export const updateCountSelectedOriginPhoto = (selectedPhotoCount) => ({
    type: UPDATE_SELECTED_ORIGIN_PHOTO,
    payload: selectedPhotoCount
})

export const updateCurrentPreviewPhoto = (basename) => ({
    type: UPDATE_CURRENT_PREVIEW_PHOTO,
    payload: basename
})

export const openPicturePreview = (show) => ({
    type: OPEN_ORIGIN_PHOTO_PREVIEW,
    payload: show
})

export const checkoutSelectedPhoto = (subpackageId) => async dispatch => {
    dispatch(setOpenLoadingPopup(true, 'Loading...'));
    dispatch({type: CHECKOUT_SELECTED_PHOTO});
    const response = api.checkoutSelectedPhoto(subpackageId);

    return response.then(
        response => {
            dispatch(setOpenLoadingPopup(false, ''));
            dispatch({type: CHECKOUT_SELECTED_PHOTO_SUCCESS, payload: response.data})
            dispatch(setOpenAlertPopup(true, 'Pemilihan foto berhasil'))
        },        
        err => {
            dispatch(setOpenLoadingPopup(false, ''));
            dispatch({type: CHECKOUT_SELECTED_PHOTO_FAIL, payload: err})
            dispatch(setOpenAlertPopup(false, 'Terjadi kesalahan silahkan coba beberapa saat lagi', 'error'))
        }
    )
}

export const getDownloadLink = (type) => async dispatch => {
    dispatch({type: GET_DOWNLOAD_LINK});

    const response = api.getLinkOfDownload(type);

    return response.then(
        response => dispatch({type: GET_DOWNLOAD_LINK_SUCESS, payload: response.data}),
        err => dispatch({type: GET_DOWNLOAD_LINK_FAIL, payload: err})
    )
}

export const setOpenDownloadPopup = (condition) => async dispatch => {
    dispatch({type: SET_OPEN_DOWNLOAD_POPUP, payload: condition});
}