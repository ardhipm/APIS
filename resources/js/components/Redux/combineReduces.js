import {combineReducers} from 'redux';
import { connectRouter } from 'connected-react-router'
import admin from './Admin/reducer'
import originPhotoReducer from './User/features/originphoto/originphoto.reducer';
import choicePhotoReducer from './User/features/choicephoto/choicephoto.reducer';
import confirmDialogReducer from './User/features/confirmdialog/confirmdialog.reducer';
import loginReducer from './Login/login.reducer';
import loadingReducer from './Popup/Loading/loading.reducer';
import alertReducer from './Popup/Alert/alert.reducer';
import notifReducer from './Notification/notification.reducer';
import albumPhotoReducer from './User/features/albumphoto/albumphoto.reducer';
import axios from 'axios';

axios.interceptors.response.use((response) => {
    return response;
}, (error) => { // Anything except 2XX goes to here
    const status = error.response?.status || 500;
    if (status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem("user");
        window.location.href= "/login";
        //  window.location = window.location.protocol + "//" + window.location.host + "/sign-in"
    } else {
        return Promise.reject(error); // Delegate error to calling side
    }
});

const createRootReducer = (history) => (combineReducers({
    router: connectRouter(history),
    admin,
    originPhotoReducer,
    choicePhotoReducer,
    confirmDialogReducer,
    loginReducer,
    loadingReducer,
    alertReducer,
    notifReducer,
    albumPhotoReducer
    
}));

export default createRootReducer;