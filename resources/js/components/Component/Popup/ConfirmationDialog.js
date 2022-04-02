import { Icon } from '@iconify/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    removeSelectedPhoto,
    resetOriginPhoto,
    getOriginPhotoWithPagination,
    checkoutSelectedPhoto
} from '../../Redux/User/features/originphoto/originphoto.action';

import {
    confirmDialogType,
    setOpenConfirmDialog
} from '../../Redux/User/features/confirmdialog/confirmdialog.action';

import { indexOriginPhoto, indexChoicePhoto } from '../../Redux/Admin/action';
import { checkoutAlbumPrintPhoto, getChoicePhotoWithPagination, resetChoicePhoto } from '../../Redux/User/features/choicephoto/choicephoto.action';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    dialogLayout: {
        borderRadius: '8px'
    },

}));

const ConfirmationDialog = () => {

    const classes = useStyles();
    const originPhotoProps = useSelector((state) => state.originPhotoReducer);
    const confirmDialogProps = useSelector((state) => state.confirmDialogReducer);
    const choicePhotoProps = useSelector((state) => state.choicePhotoReducer);
    let { customerId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {

    }, [confirmDialogProps.show])

    const refreshOriginPhoto = () => {
        dispatch(resetOriginPhoto());
        for (let i = 1; i <= originPhotoProps.pageNumber; i++) {
            dispatch(getOriginPhotoWithPagination(originPhotoProps.selectedSubPackageIdx, 1));
        }
    }

    const refreshChoicePhoto = () => {
        dispatch(resetChoicePhoto());
        for (let i = 1; i <= choicePhotoProps.pageNumber; i++) {
            dispatch(getChoicePhotoWithPagination(choicePhotoProps.selectedSubPackageIdx, 1));
        }
    }

    const handleClose = () => {
        dispatch(setOpenConfirmDialog(false, confirmDialogProps.message, null));
    }

    const handleConfirm = () => {
        switch (confirmDialogProps.type) {
            case confirmDialogType.CHECKOUT_SELECTED_PHOTO:
                // console.log('confirmSelectedCheckout')
                dispatch(checkoutSelectedPhoto(originPhotoProps.selectedSubPackageIdx));
                dispatch(setOpenConfirmDialog(false, confirmDialogProps.message, null));
                // refreshOriginPhoto();
                break;
            // case 'confirmDeletePhoto':
            case confirmDialogType.DELETE_CHOICE_PHOTO_AFTER_CHECKOUT:
                // console.log('confirmDeletePhoto');
                dispatch(removeSelectedPhoto(originPhotoProps.currentPhotoPreview));
                dispatch(setOpenConfirmDialog(false, confirmDialogProps.message, null));
                // refreshOriginPhoto();
                break;
            case confirmDialogType.CHECKOUT_ALBUM_PRINT_PHOTO:
                dispatch(checkoutAlbumPrintPhoto());
                dispatch(setOpenConfirmDialog(false, confirmDialogProps.message, null));
                // refreshChoicePhoto();
                break;
            case confirmDialogType.INDEX_ORIGIN_PHOTO:
                // console.log(customerId);
                dispatch(indexOriginPhoto(customerId));
                dispatch(setOpenConfirmDialog(false, confirmDialogProps.message, null));
                break;
            case confirmDialogType.INDEX_CHOICE_PHOTO:
                // console.log(customerId);
                dispatch(indexChoicePhoto(customerId));
                dispatch(setOpenConfirmDialog(false, confirmDialogProps.message, null));
                break;
            default:
                return null
        }
        // dispatch(executeConfirm());
    }

    return (
        <>
            <Dialog open={originPhotoProps.openConfirmDialog} className={classes.dialogLayout} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="center">
                        <Grid item xs={12}>
                            <Icon icon="akar-icons:circle-alert-fill" style={{ color: 'yellow' }} height={80} width={80} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ fontWeight: 'bold', marginTop: '40px', marginBottom: '40px' }}>
                                {originPhotoProps.confirmDialogMessage}
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary" fullWidth style={{ textTransform: 'capitalize' }}>
                        Kembali
                    </Button>
                    <Button onClick={handleConfirm} variant="contained" color="primary" fullWidth style={{ textTransform: 'capitalize' }} >
                        Ya
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfirmationDialog;