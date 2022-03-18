import { Modal } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { setOpenAlertPopup } from '../../../Redux/Popup/Alert/alert.action'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// const useStyles = makeStyles((theme) => ({
//     root: {
//         width: '100%',
//         '& > * + *': {
//             marginTop: theme.spacing(2),
//         },
//     },
// }));



const PhotoAlert = () => {
    const alertProps = useSelector((state) => state.alertReducer)
    const dispatch = useDispatch();

    useEffect(() => {

    }, [alertProps.show])

    const handleOnClose = () => {
        dispatch(setOpenAlertPopup(false, alertProps.message, alertProps.type));
    }


    return (
        <>
            <Snackbar 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={alertProps.show} 
                autoHideDuration={4000} 
                onClose={handleOnClose}>
                <Alert onClose={handleOnClose} severity={alertProps.type}>
                    {alertProps.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default PhotoAlert;