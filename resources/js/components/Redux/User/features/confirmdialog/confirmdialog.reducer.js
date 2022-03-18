import {
    SET_YESNO_DIALOG
} from '../../../actionTypes'

const initialState = {
    showDialog: false,
    message: '',
    type: ''
}

const confirmDialogReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_YESNO_DIALOG:
            return {
                ...state,
                showDialog: action.payload.open,
                message: action.payload.message,
                type: action.payload.type
            }
        default: 
            return state
    }
}

export default confirmDialogReducer;