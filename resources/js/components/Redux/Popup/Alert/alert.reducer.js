import {
    OPEN_ALERT
} from '../../actionTypes';

const initialState = {
    show: false,
    message: '',
    type:'',
}

const alertReducer = (state = initialState, action) => {
    
    switch(action.type){
        case OPEN_ALERT:
            return {
                ...state,
                show: action.payload.open,
                message: action.payload.message,
                type: action.payload.type
            }
        default: 
            return state
    }
}

export default alertReducer;