import { Button, Checkbox, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Label } from '@material-ui/icons';
import {
    updateCurrentPreviewPhoto,
    openPicturePreview,
    addSelectAlbumPhoto,
    addSelectPrintPhoto,
    deleteSelectAlbumPhoto,
    deleteSelectPrintPhoto
} from '../../../Redux/User/features/choicephoto/choicephoto.action';
import { setOpenAlertPopup } from '../../../Redux/Popup/Alert/alert.action';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
        height: 245,
        borderRadius: 16 + 'px',
        // backgroundImage: `url("/img/foto.png")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'right'

    },
    media: {

    },
    checkLayout: {

    },
    icon: {
        color: '#559DCC'
    },
    defaultBtn: {
        color: 'rgba(0, 0, 0, 0.23)',
        '&:hover': {
            color: 'black'
        }
    },
    iconAlbumSelected: {
        color: '#FB9300',
        borderColor: '#FB9300',
        fontWeight: 'bold'
    },
    iconPrintSelected: {
        color: '#F54748',
        borderColor: '#F54748',
        fontWeight: 'bold'
    },
})

const ChoicePhotoPicture = ({
    id,
    isAlbumSelected,
    isPrintSelected,
    isEdited,
    albumBasename,
    printBasename,
    filename,
    innerRef,
    src }) => {

    const height = '150px';
    const width = '150px';

    const classes = useStyles();
    const choicePhotoProps = useSelector((state) => state.choicePhotoReducer)
    const dispatch = useDispatch();

    const [selectAlbum, setSelectAlbum] = useState(isAlbumSelected);
    const [selectPrint, setSelectPrint] = useState(isPrintSelected);

    const handleAlbumSelected = () => {
        if (choicePhotoProps.restrictedAlbumPhoto == 1) {
            dispatch(setOpenAlertPopup(true, "Tidak dapat memilih, Aksi telah dibatasi", "error"))
            return;
        }
        if (choicePhotoProps.totalSelectedAlbumPhoto >= choicePhotoProps.totalLimitAlbumPhoto && !selectAlbum === true) {
            dispatch(setOpenAlertPopup(true, "Maksimal foto album telah terisi", "error"))
            return;
        }
        if(albumBasename!= null){
            dispatch(setOpenAlertPopup(true, "Tidak dapat memilih, Foto telah menjadi album", "error"))
            return;
        }
        setSelectAlbum(!selectAlbum);
        if (!selectAlbum === true) {
            dispatch(addSelectAlbumPhoto(src, choicePhotoProps.selectedSubPackageIdx));
        } else {
            dispatch(deleteSelectAlbumPhoto(src, choicePhotoProps.selectedSubPackageIdx));
        }
    }

    const handlePrintSelected = () => {
        if (choicePhotoProps.restrictedAlbumPhoto == 1) {
            dispatch(setOpenAlertPopup(true, "Tidak dapat memilih, Aksi telah dibatasi", "error"))
            return;
        }
        if (choicePhotoProps.totalSelectedPrintPhoto >= choicePhotoProps.totalLimitPrintPhoto && !selectPrint === true) {
            dispatch(setOpenAlertPopup(true, "Maksimal foto untuk print telah terisi", "error"))
            return;
        }
        if(printBasename!= null){
            dispatch(setOpenAlertPopup(true, "Tidak dapat memilih, Foto telah menjadi foto cetak", "error"))
            return;
        }

        setSelectPrint(!selectPrint);
        if (!selectPrint === true) {
            dispatch(addSelectPrintPhoto(src, choicePhotoProps.selectedSubPackageIdx));
        } else {
            dispatch(deleteSelectPrintPhoto(src, choicePhotoProps.selectedSubPackageIdx));
        }
    }

    const handleOpenPicture = (event) => {
        // console.log(event.target.className != "MuiButton-label");
        // console.log(event)
        if (event.target.className != "MuiButton-label") {
            // setZoom(true);
            dispatch(updateCurrentPreviewPhoto(src));
            dispatch(openPicturePreview(true));
        }

    }

    return (
        <>
            <div id={id} ref={innerRef} style={{ position: 'relative', maxWidth: height }} onClick={handleOpenPicture}>
                <div className="flip-entry-visual" style={{ textAlign: 'center' }}>
                    <div className="flip-entry-visual-card">
                        <div className="flip-entry-thumb">
                            {/* <img src="https://drive.google.com/thumbnail?id=1DobPY--FVIMLEiLJqKo33epm4MiheZ6L" alt="JPEG Image" /> */}
                            {/* {src === null ? <PanoramaIcon/>: } */}
                            <img src={`https://drive.google.com/thumbnail?id=${src}`} style={{ objectFit: 'contain', height: height, width: width }} alt="JPEG Image" loading="lazy" />
                        </div>
                    </div>
                    <div className='flip-entry-text'>
                        {/* {filename} */}

                        <div style={{ display: 'flex', flexFlow: 'column' }}>
                            <div>{filename}</div>
                            {isEdited == 1 ? <>
                                <Button
                                    // id="btn-select-album"
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                    disableTouchRipple={true}
                                    variant="outlined"
                                    style={{ marginTop: '4px', marginBottom: '4px' }}
                                    className={selectAlbum ? classes.iconAlbumSelected : classes.defaultBtn}
                                    onClick={handleAlbumSelected}>Album</Button>
                                <Button
                                    // id="btn-select-print"
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                    disableTouchRipple={true}
                                    variant="outlined"
                                    className={selectPrint ? classes.iconPrintSelected : classes.defaultBtn}
                                    style={{ marginBottom: '4px' }}
                                    onClick={handlePrintSelected}>Cetak</Button>
                            </>
                                :
                                <div>Foto sedang dalam pengeditan</div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>
    )


}

export default ChoicePhotoPicture;