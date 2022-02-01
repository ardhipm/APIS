
import { api } from './originphoto.api'
import {
    GET_ORIGIN_PHOTO,
    GET_ORIGIN_PHOTO_SUCCESS,
    GET_ORIGIN_PHOTO_FAIL,
    GET_ORIGIN_PHOTO_WITH_PAGINATION,
    GET_ORIGIN_PHOTO_WITH_PAGINATION_SUCCESS
} from '../../../actionTypes'


export const getOriginPhoto = () => dispatch => {
    dispatch({
        type: GET_ORIGIN_PHOTO
    });
    const request = api.getOriginPhoto();

    return request.then(
        response => dispatch({type: GET_ORIGIN_PHOTO_SUCCESS, payload: response.data}),        
        err => dispatch({type: GET_ORIGIN_PHOTO_FAIL, payload: err})
    );
    
};

export const getOriginPhotoWithPagination =  (kategori, page) => async dispatch => {
    const request = await dispatch({
        type: GET_ORIGIN_PHOTO_WITH_PAGINATION,
        payload: api.getOriginPhotoWithPagination(kategori, page)
    });
    return request.then(
        response => dispatch({type: GET_ORIGIN_PHOTO_WITH_PAGINATION_SUCCESS, payload: response.data}),        
        err => dispatch({type: GET_ORIGIN_PHOTO_WITH_PAGINATION_FAIL, payload: err})
    );
    
};
