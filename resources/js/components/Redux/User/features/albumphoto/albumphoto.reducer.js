import {
    GET_ALBUM_PHOTO,
    GET_ALBUM_PHOTO_SUCCESS,
    GET_ALBUM_PHOTO_FAIL,
    RESET_ALBUM_PHOTO,
    UPDATE_CURRENT_PREVIEW_PHOTO,
    SHOW_PREVIEW_ALBUM_PHOTO
} from '../../../actionTypes'

const initialState = {
    loading: false,
    photoAlbumData: [],
    message: {
        show: false,
        text: ''
    },
    showPreview: false,
    currentBasenamePreview: '',
}

const albumPhotoReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALBUM_PHOTO:
            return {
                ...state,
                loading: true
            };
        case GET_ALBUM_PHOTO_SUCCESS:
            return {
                ...state,
                loading: false,
                photoAlbumData: action.payload.data.data
                
            };
        case GET_ALBUM_PHOTO_FAIL:
            return {
                ...state,
                loading: false,
                photoAlbumData: []
            };
        case RESET_ALBUM_PHOTO:
            return {
                photoAlbumData: []
            };
        case UPDATE_CURRENT_PREVIEW_PHOTO:
            return {
                ...state,
                currentBasenamePreview: action.payload
            };
        case SHOW_PREVIEW_ALBUM_PHOTO:
            return {
                ...state,
                showPreview: action.payload
            }
        default:
            return state;
    }
}
export default albumPhotoReducer;