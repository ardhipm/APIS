import {
    SET_OPEN_LOADING
} from '../../../Redux/actionTypes';

const initialState = {
    show: false,
    message: '',
}

const loadingReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_OPEN_LOADING:
            return {
                ...state,
                show: action.payload.open,
                message: action.payload.message,
            }
        default: 
            return state
    }
}

export default loadingReducer;