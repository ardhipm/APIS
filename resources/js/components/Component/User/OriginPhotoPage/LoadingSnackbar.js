import { CircularProgress, Modal } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenAlertPopup } from '../../../Redux/Popup/Alert/alert.action';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" icon={<CircularProgress disableShrink style={{ scale: '0.5' }} />} {...props} />;
}

const useStyles = makeStyles((theme) => ({  
    loadingRoot: {
        backgroundColor: 'white',
    },
    loadingIcon: {
        padding: 0
    },
    loadingMessage: {
        margin: 'auto',
        color: 'black',
        marginRight: '40px'
    },
    loadingAction: {
        display: 'none'
    }
}));


const LoadingSnackbar = () => {
    const classes = useStyles();
    const originPhotoProps = useSelector((state) => state.originPhotoReducer);
    const loadingProps = useSelector((state) => state.loadingReducer)
    const dispatch = useDispatch();

    useEffect(() => {

    }, [loadingProps.show])

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={loadingProps.show}
                // autoHideDuration={4000}
            // onClose={handleOnClose}
            >
                <Alert
                    classes={{
                        root: classes.loadingRoot,
                        message: classes.loadingMessage,
                        action: classes.loadingAction,
                        icon : classes.loadingIcon
                    }}>
                    {loadingProps.message}
                    {/* {originPhotoProps.alertMessage} */}
                </Alert>
            </Snackbar>
        </>
    );
}

export default LoadingSnackbar;