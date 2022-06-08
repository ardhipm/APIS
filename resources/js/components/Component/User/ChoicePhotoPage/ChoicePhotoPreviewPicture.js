import { Icon } from '@iconify/react';
import { Button, CircularProgress, makeStyles } from '@material-ui/core';
import { border } from '@material-ui/system';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateCurrentPreviewPhoto,
    openPicturePreview,
    addSelectAlbumPhoto,
    addSelectPrintPhoto,
    deleteSelectAlbumPhoto,
    deleteSelectPrintPhoto
} from '../../../Redux/User/features/choicephoto/choicephoto.action';
import { setOpenConfirmDialog } from '../../../Redux/User/features/confirmdialog/confirmdialog.action';
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
    },
    defaultBtn: {
        color: 'rgba(0, 0, 0, 0.23)',
        backgroundColor: 'white',
        border: '1px solid black',
        '&:hover': {
            color: 'black',
            backgroundColor: '#d4d4d3'
        }
    },
    iconAlbumSelected: {
        color: '#FB9300',
        borderColor: '#FB9300',
        backgroundColor: 'white',
        fontWeight: 'bold',
        '&:hover': {

            backgroundColor: '#d4d4d3'
        }
    },
    iconPrintSelected: {
        color: '#F54748',
        borderColor: '#F54748',
        backgroundColor: 'white',
        fontWeight: 'bold',
        '&:hover': {

            backgroundColor: '#d4d4d3'
        }
    },

}));

const ChoicePhotoPreveiwPicture = () => {
    const choicePhotoProps = useSelector((state) => state.choicePhotoReducer);
    const classes = useStyles();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [albumSelect, setAlbumSelect] = useState(false);
    const [printSelect, setPrintSelect] = useState(false);

    useEffect(() => {
        setLoading(true);
    }, [])

    useEffect(() => {

    }, [loading])

    useEffect(() => {
        // console.log('kesini aja bray')
        // console.log('----->',choicePhotoProps.showPreview)

    }, [choicePhotoProps.currentChoicePhoto])

    useEffect(() => {
        setError(false);
        if (choicePhotoProps.showPreview) setLoading(true);
        choicePhotoProps.currentChoicePhoto.map((element, index) => {
            if (element.basename === choicePhotoProps.currentPhotoPreview) {
                setAlbumSelect(element.is_album_selected);
                setPrintSelect(element.is_print_selected);
            }
        })

        // register key listener
        document.addEventListener('keydown', handleKeyNextPrev)
        return () => {
            document.removeEventListener('keydown', handleKeyNextPrev)
        }
    }, [choicePhotoProps.showPreview,choicePhotoProps.currentPhotoPreview])

    // add arrow left and right listener
    const handleKeyNextPrev = (e) => {
        if (e.keyCode == 39) {
            let btnNext = document.getElementById("choice-btn-next")
            btnNext.click();
        }
        if (e.keyCode == 37) {
            let btnNPrev = document.getElementById("choice-btn-prev")
            btnNPrev.click();
        }
    }

    

    const handleOnClose = (e) => {
        console.log('=====>',e)
        if (e.target.id === 'choice-photo-preview-layout' || e.target.id === 'choice-photo-preview-container') dispatch(openPicturePreview(false))
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
        setLoading(false);
        setError(true);
    }

    const handleAlbumSelected = () => {

        if (choicePhotoProps.restrictedAlbumPhoto == 1) {
            dispatch(setOpenAlertPopup(true, "Tidak dapat memilih, Aksi telah dibatasi", "error"))
            return;
        }
        if (choicePhotoProps.totalSelectedAlbumPhoto >= choicePhotoProps.totalLimitAlbumPhoto && !albumSelect === true) {
            dispatch(setOpenAlertPopup(true, "Maksimal foto album telah terisi", "error"))
            return;
        }
        setAlbumSelect(!albumSelect);
        if (!albumSelect === true) {
            dispatch(addSelectAlbumPhoto(choicePhotoProps.currentPhotoPreview, choicePhotoProps.selectedSubPackageIdx));
        } else {
            dispatch(deleteSelectAlbumPhoto(choicePhotoProps.currentPhotoPreview, choicePhotoProps.selectedSubPackageIdx));
        }

        // console.log(selectAlbum);
    }

    const handlePrintSelected = () => {
        if (choicePhotoProps.restrictedAlbumPhoto == 1) {
            dispatch(setOpenAlertPopup(true, "Tidak dapat memilih, Aksi telah dibatasi", "error"))
            return;
        }

        if (choicePhotoProps.totalSelectedPrintPhoto >= choicePhotoProps.totalLimitPrintPhoto && !printSelect === true) {
            dispatch(setOpenAlertPopup(true, "Maksimal foto untuk print telah terisi", "error"))
            return;
        }

        setPrintSelect(!printSelect);
        if (!printSelect === true) {
            dispatch(addSelectPrintPhoto(choicePhotoProps.currentPhotoPreview, choicePhotoProps.selectedSubPackageIdx));
        } else {
            dispatch(deleteSelectPrintPhoto(choicePhotoProps.currentPhotoPreview, choicePhotoProps.selectedSubPackageIdx));
        }
        // console.log(selectPrint);
    }



    const handleSelectedPhoto = (e) => {
        if (e.target.checked) {




        } else {
            const currentObject = choicePhotoProps.currentChoicePhoto.filter(element => element.basename == choicePhotoProps.currentPhotoPreview);
            if (currentObject[0].choice_basename != null) {
                // dispatch(setOpenConfirmDialog(true, "Foto telah masuk pada foto pilihan, lanjutan untuk menghapus ?", "confirmDeletePhoto"))
            } else {


            }

        }
    }

    const navigation = choicePhotoProps.currentChoicePhoto.map((element, index) => {


        let prevEl = choicePhotoProps.currentChoicePhoto[index - 1];
        let nextEl = choicePhotoProps.currentChoicePhoto[index + 1];

        if (prevEl === undefined) prevEl = choicePhotoProps.currentChoicePhoto[choicePhotoProps.currentChoicePhoto.length - 1];
        if (nextEl === undefined) nextEl = choicePhotoProps.currentChoicePhoto[0];

        if (element.basename === choicePhotoProps.currentPhotoPreview) {
            return (
                <div key={element.basename}>
                    {element.is_edited == 1 ? <div style={{ position: 'absolute', top: '0', right: '0', display: 'flex', width: '22em' }}>

                        <Button
                            // id="btn-select-album"
                            disableRipple={true}
                            disableFocusRipple={true}
                            disableTouchRipple={true}
                            variant="outlined"
                            style={{ flex: '1' }}
                            className={albumSelect ? classes.iconAlbumSelected : classes.defaultBtn}
                            onClick={handleAlbumSelected}
                        >Album</Button>
                        <Button
                            // id="btn-select-print"
                            disableRipple={true}
                            disableFocusRipple={true}
                            disableTouchRipple={true}
                            variant="outlined"
                            className={printSelect ? classes.iconPrintSelected : classes.defaultBtn}
                            style={{ marginLeft: '8px', flex: '1' }}
                            onClick={handlePrintSelected}
                        >Cetak</Button>

                    </div> : null}
                    <Button
                        id="choice-btn-prev"
                        className={classes.prevBtn}
                        key={1}
                        onClick={(e) => handlePrevNext(e, prevEl.basename)}
                        endIcon={<Icon icon="grommet-icons:previous" style={{ color: 'white', fontSize: '60px' }} />}
                    ></Button>
                    <Button
                        id="choice-btn-next"
                        className={classes.nextBtn}
                        key={2}
                        onClick={(e) => handlePrevNext(e, nextEl.basename)}
                        startIcon={<Icon icon="grommet-icons:next"
                            style={{ color: 'white', fontSize: '60px' }} />}
                    ></Button>
                </div>
            )
        }
    })


    return (
        <>
            <div id="choice-photo-preview-layout" className={classes.outterLayout}
                style={choicePhotoProps.showPreview ? { display: 'block' } : { display: 'none' }}
                onClick={handleOnClose}
            >
                {/* 'https://drive.google.com/uc?export=view&id=' + value; */}
                {/* https://drive.google.com/a/domain.com/thumbnail?id=1Iy6mZcS-kcIG--q6sJndd-J65F_cKkf4&sz=w1200-h{height} */}
                {/* 1Iy6mZcS-kcIG--q6sJndd-J65F_cKkf4 */}
                {/* 1g_KNWaDkNrYKY2yLBJtdLJRSBMAmUhgU */}


                <div id="choice-photo-preview-container" className={classes.imgContainer}>
                    {/* {loading && <CircularProgress />} */}
                    {loading && <CircularProgress className={classes.loadingBar} />}
                    {error && 'Failed to load image'}

                    <img
                        hidden={loading}
                        onLoad={handleOnLoad}
                        onError={handleImageErrored}
                        src={`https://drive.google.com/thumbnail?id=${choicePhotoProps.currentPhotoPreview}&sz=h1000`}
                        style={{ objectFit: 'contain', height: '100%' }}
                        alt="JPEG Image"
                        loading="eager" />
                    {/* filename : {choicePhotoProps.currentPhotoPreview} */}
                    {navigation}
                </div>
            </div>
        </>
    );

}

export default ChoicePhotoPreveiwPicture;