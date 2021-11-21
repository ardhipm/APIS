import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const LogoutDialog = (props) => {

    const handleClose = () => {
        props.closePopup();
    }

    const handleLogout = () => {

        const token = localStorage.getItem('authToken');

        axios.request({
            method: 'post',
            url: '/api/logout',
            headers: {'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token}})
        .then(res => {
                //console.log(res);
                localStorage.setItem('FIRST_TERMS', true)
                if (res.data.success == true) {
                    //console.log('keluar');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem("user");
                    window.location.href= "/";

                } else {
                }

            })
            .catch(error => {
                //console.log(error);
            })
    }

    return (

        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Peringatan"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Apakah Anda Yakin ingin keluar ?
          </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Batalkan
          </Button>
                <Button onClick={handleLogout} color="primary">
                    Keluar
          </Button>
            </DialogActions>
        </Dialog>
    );

}

export default LogoutDialog;