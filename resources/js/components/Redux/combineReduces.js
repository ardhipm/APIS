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

const createRootReducer = (history) => (combineReducers({
    router: connectRouter(history),
    admin,
    originPhotoReducer,
    choicePhotoReducer,
    confirmDialogReducer,
    loginReducer,
    loadingReducer,
    alertReducer,
    notifReducer
    
}));

export default createRootReducer;