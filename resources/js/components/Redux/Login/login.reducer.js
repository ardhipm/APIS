import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    IS_TOKEN_EXISTS,
    UPDATE_USER,
    UPDATE_USER_SUCCESS
} from '../actionTypes';


const initialState = {
    isAuthenticated: false,
    username: '',
    accessToken: '',
    splashscreen: false,
    loading: false,
    user: {
        username:'',
        roleId: '',
        isActive:false,
    }
}

const loginReducer = (state = initialState, action) => {
    // console.log('==============')
    // console.log(action.type)
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                loading: true
            }
        case LOGIN_SUCCESS:
            // console.log(action.payload);
            localStorage.setItem("authToken", action.payload.access_token);
            localStorage.setItem("user", JSON.stringify({
                username: action.payload.user.username,
                roleId: action.payload.user.role,
                isActive: action.payload.user.is_active
            }));
            
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                accessToken: action.payload.access_token,
                user: {
                    ...state.user,
                    username: action.payload.user.username,
                    roleId: action.payload.user.role,
                    isActive: action.payload.user.is_active
                }
            }
        case LOGIN_FAIL:
            return {
                ...state,
                loading: false,
                splashscreen: false
            }

        case IS_TOKEN_EXISTS:
            return {
                ...state,
                isAuthenticated: action.payload
            }

        case UPDATE_USER: 
            return {
                ...state,
                loading: true
            }
        case UPDATE_USER_SUCCESS: 
            return {
                ...state,
                isAuthenticated: true,
            }
        default:
            return state;
    }
}

export default loginReducer;