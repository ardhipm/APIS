import {
    GET_ORIGIN_PHOTO,
    GET_ORIGIN_PHOTO_SUCCESS,
    GET_ORIGIN_PHOTO_FAIL,
    GET_ORIGIN_PHOTO_WITH_PAGINATION,
    GET_ORIGIN_PHOTO_WITH_PAGINATION_SUCCESS,
    GET_ORIGIN_PHOTO_WITH_PAGINATION_FAIL,
} from '../../../actionTypes'

const initialState = {
    originPhoto: null,
    loading: false,
    totalPhoto: 0,
    totalRestrictedPhoto: 0,
    totalSelectedPhoto: 0,
    description: '',
    title: '',
    isError: false,
}

const reducer = (state = initialState, action) => {
    console.log('===============');
    console.log(action.type);
    console.log(action);
    switch (action.type) {
        case GET_ORIGIN_PHOTO:
            return {
                ...state
            };
        case GET_ORIGIN_PHOTO_SUCCESS:
            console.log('asd');
            return {
                ...state,
                originPhoto: action.payload.data,
                description: 'Hello dude',
            };
        case GET_ORIGIN_PHOTO_FAIL:
            return {
                ...state,
                originPhoto: action.payload
            };
        case GET_ORIGIN_PHOTO_WITH_PAGINATION:
            return {
                ...state,
                loading: true
            };
        case GET_ORIGIN_PHOTO_WITH_PAGINATION_SUCCESS:
            console.log('asd');
            return {
                ...state,
                loading: false,
                originPhoto: action.payload.data,
                totalPhoto: action.payload.data.length
            };
        case GET_ORIGIN_PHOTO_WITH_PAGINATION_FAIL:
            return {
                ...state,
                loading: false,
                originPhoto: action.payload.data,
                totalPhoto: action.payload.data.length
            };

        default:
            return state;
    }
}
export default reducer;