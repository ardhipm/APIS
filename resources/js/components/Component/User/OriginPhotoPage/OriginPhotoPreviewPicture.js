import { Button, Card, CardMedia, Checkbox, CircularProgress, makeStyles } from '@material-ui/core';
import { Icon } from '@iconify/react';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import React, { useEffect, useState } from 'react';
import originPhotoReducer from '../../../Redux/User/features/originphoto/originphoto.reducer';
import { useDispatch, useSelector } from 'react-redux';
import {
    openPicturePreview,
    updateCurrentPreviewPhoto,
    addSelectedPhoto,
    removeSelectedPhoto,
    resetOriginPhoto,
    getOriginPhotoWithPagination,
} from '../../../Redux/User/features/originphoto/originphoto.action';
import {
    confirmDialogType,
    setOpenConfirmDialog
} from '../../../Redux/User/features/confirmdialog/confirmdialog.action';
import zIndex from '@material-ui/core/styles/zIndex';
import { setOpenAlertPopup } from '../../../Redux/Popup/Alert/alert.action'; 



const useStyles = makeStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    dialogLayout: {
        maxWidth: '800px'
    },
    imgLayout: {
        maxWidth: '100%'
    },
    outterLayout: {
        minWidth: '100%',
        maxWidth: '100%',
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        padding: '3em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardLayout: {
        display: 'contents',
        backgroundColor: 'rgba(0,0,0,0.0)',
        boxShadow: 'none',
        alignItems: 'center',
        zIndex: theme.zIndex.drawer + 2,
    },
    checkLayout: {
        position: 'absolute',
        top: '0',
        left: '0',
        // padding: '16px'
    },
    icon: {
        fontSize: '60px',
        color: '#559DCC'
    },
    imgContainer: {
        position: 'relative',
        height: '100%',
        textAlign: 'center'
    },
    prevBtn: {
        position: 'absolute',
        left: 0,
        top: '50%'
    },
    nextBtn: {
        position: 'absolute',
        right: 0,
        top: '50%'
    },
    loadingBar: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        color: 'white',
        zIndex: theme.zIndex.drawer + 10
    }

}));

const OriginPhotoPreviewPicture = (props) => {
    const classes = useStyles();
    const originPhotoProps = useSelector((state) => state.originPhotoReducer);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    // const [errorMsg, setErrorMsg] = useState('failed to load');

    useEffect(() => {
        setLoading(true);
    }, [])

    useEffect(() => {

    }, [loading])

    useEffect(() => {
        // console.log('kesini aja bray')
        // console.log('----->',originPhotoProps.showPreview)

    }, [originPhotoProps.basename, originPhotoProps.currentOriginPhoto])

    useEffect(() => {
        setError(false);
        if (originPhotoProps.showPreview) setLoading(true);
    }, [originPhotoProps.showPreview])

    const handleOnClose = (e) => {
        // console.log(e)
        if (e.target.id === 'origin-photo-preview-layout' || e.target.id === 'origin-photo-preview-container') dispatch(openPicturePreview(false))
        if (e.target.tagName === 'IMG') return
    }

    const handlePrevNext = (e, src) => {
        setLoading(true);
        dispatch(updateCurrentPreviewPhoto(src));
    }

    const handleOnLoad = () => {
        // console.log('test on load img');
        setLoading(false);
    }

    const handleImageErrored = () => {
        setError(true);
    }

    const refreshOriginPhoto = () => {
        dispatch(resetOriginPhoto());
        for (let i = 1; i <= originPhotoProps.pageNumber; i++) {
            dispatch(getOriginPhotoWithPagination(originPhotoProps.selectedSubPackageIdx, 1));
        }
    }

    const handleSelectedPhoto = (e) => {
        if (e.target.checked) {
            if (originPhotoProps.subPackageNumSelectedEditPhoto >= originPhotoProps.subPackageNumEditPhoto) {
                dispatch(setOpenAlertPopup(true, "Maksimal foto telah terisi", "error"))
            } else {
                dispatch(addSelectedPhoto(originPhotoProps.currentPhotoPreview , originPhotoProps.selectedSubPackageIdx));
            }
        } else {
            const currentObject = originPhotoProps.currentOriginPhoto.filter(element => element.basename == originPhotoProps.currentPhotoPreview);
            if(currentObject[0].choice_basename != null){
                dispatch(setOpenConfirmDialog(true, "Foto telah masuk pada foto pilihan, lanjutan untuk menghapus ?", confirmDialogType.DELETE_CHOICE_PHOTO_AFTER_CHECKOUT))
            }else{
                dispatch(removeSelectedPhoto(originPhotoProps.currentPhotoPreview));

            }

        }
    }


    return (
        <>
            <div id="origin-photo-preview-layout" className={classes.outterLayout}
                style={originPhotoProps.showPreview ? { display: 'block' } : { display: 'none' }}
                onClick={handleOnClose}
            >
                {/* 'https://drive.google.com/uc?export=view&id=' + value; */}
                {/* https://drive.google.com/a/domain.com/thumbnail?id=1Iy6mZcS-kcIG--q6sJndd-J65F_cKkf4&sz=w1200-h{height} */}
                {/* 1Iy6mZcS-kcIG--q6sJndd-J65F_cKkf4 */}
                {/* 1g_KNWaDkNrYKY2yLBJtdLJRSBMAmUhgU */}


                <div id="origin-photo-preview-container" className={classes.imgContainer}>
                    {/* {loading && <CircularProgress />} */}
                    {loading && <CircularProgress className={classes.loadingBar} />}
                    {error && 'Failed to load image'}
                    <img
                        hidden={loading}
                        onLoad={handleOnLoad}
                        onError={handleImageErrored}
                        src={`https://drive.google.com/thumbnail?id=${originPhotoProps.currentPhotoPreview}&sz=h1000`}
                        style={{ objectFit: 'contain', height: '100%' }}
                        alt="JPEG Image"
                        loading="eager" />
                    {/* filename : {originPhotoProps.currentPhotoPreview} */}
                    {originPhotoProps.currentOriginPhoto.map((element, index) => {

                        let prevEl = originPhotoProps.currentOriginPhoto[index - 1];
                        let nextEl = originPhotoProps.currentOriginPhoto[index + 1];

                        if (prevEl === undefined) prevEl = originPhotoProps.currentOriginPhoto[originPhotoProps.currentOriginPhoto.length - 1];
                        if (nextEl === undefined) nextEl = originPhotoProps.currentOriginPhoto[0];

                        if (element.basename === originPhotoProps.currentPhotoPreview) {
                            return (
                                <div key={element.basename}>
                                    <Checkbox
                                        icon={<RadioButtonUncheckedIcon className={classes.icon} />}
                                        checkedIcon={<CheckCircleIcon className={classes.icon} />}
                                        // style={{position: 'absolute', top: '0', right: '0'}}
                                        className={classes.checkLayout}
                                        key={element.basename}
                                        checked={element.is_selected === 1}
                                        onChange={handleSelectedPhoto}
                                        name="checkedA" />
                                    {/* <span>isSelect : {element.isSelected}</span> */}
                                    <Button
                                        className={classes.prevBtn}
                                        key={1}
                                        onClick={(e) => handlePrevNext(e, prevEl.basename)}
                                        endIcon={<Icon icon="grommet-icons:previous" style={{ color: 'white', fontSize: '60px' }} />}
                                    ></Button>
                                    <Button
                                        className={classes.nextBtn}
                                        key={2}
                                        onClick={(e) => handlePrevNext(e, nextEl.basename)}
                                        startIcon={<Icon icon="grommet-icons:next"
                                            style={{ color: 'white', fontSize: '60px' }} />}
                                    ></Button>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </>
    )
}

export default OriginPhotoPreviewPicture;