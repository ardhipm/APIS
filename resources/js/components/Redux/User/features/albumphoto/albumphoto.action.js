
import { api } from './albumphoto.api';
import {
    GET_ALBUM_PHOTO,
    GET_ALBUM_PHOTO_SUCCESS,
    GET_ALBUM_PHOTO_FAIL,
    RESET_ALBUM_PHOTO,
    UPDATE_CURRENT_PREVIEW_PHOTO,
    SHOW_PREVIEW_ALBUM_PHOTO
} from '../../../actionTypes'

export const getAlbumPhoto = (albumPhoto) => dispatch => {

    dispatch({
        type: RESET_ALBUM_PHOTO
    });

    dispatch({
        type: GET_ALBUM_PHOTO
    });

    const request = api.getAlbumPhoto(albumPhoto);

    return request.then(
        response => dispatch({type: GET_ALBUM_PHOTO_SUCCESS, payload: response}),
        err => dispatch({type: GET_ALBUM_PHOTO_FAIL, payload: err})
    );
}

export const updateCurrentPreviewPhoto = (basename) => ({
    type: UPDATE_CURRENT_PREVIEW_PHOTO,
    payload: basename
})

export const showPreviewAlbumPhoto = (show) => ({
    type: SHOW_PREVIEW_ALBUM_PHOTO,
    payload: show
})