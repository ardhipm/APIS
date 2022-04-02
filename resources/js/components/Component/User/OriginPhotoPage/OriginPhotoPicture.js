import React, { useEffect, useState } from 'react';
import { Checkbox, makeStyles } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PanoramaIcon from '@material-ui/icons/Panorama';
import { addSelectedPhoto, 
    removeSelectedPhoto, 
    getOriginPhotoWithPagination, 
    resetOriginPhoto, 
    updateCurrentPreviewPhoto, 
    openPicturePreview
 } from '../../../Redux/User/features/originphoto/originphoto.action';

import {
    confirmDialogType,
    setOpenConfirmDialog
} from '../../../Redux/User/features/confirmdialog/confirmdialog.action';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenAlertPopup } from '../../../Redux/Popup/Alert/alert.action';

// const height = '100px';
// const width = '100px';
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
    iconAlbumSelected: {
        color: '#FB9300'
    },
    iconPrintSelected: {
        color: '#F54748'
    }
})

const OriginPhotoPicture = ({ id, src, choice, filename, innerRef, isSelected, idx }) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const originPhotoProps = useSelector((state) => state.originPhotoReducer);
    const [isSelectedState, setIsSelectedState] = useState(isSelected == 1?true:false);

    const height = '150px';
    const width = '150px';

    useEffect(() => {
        setIsSelectedState(isSelected === 1)
    }, [originPhotoProps.currentOriginPhoto[idx].is_selected])
    useEffect(() => {
        
    }, [src, isSelectedState]);

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
                setIsSelectedState(e.target.checked);
                dispatch(addSelectedPhoto(src, originPhotoProps.selectedSubPackageIdx));
                // refreshOriginPhoto();
            }
        } else {
            dispatch(updateCurrentPreviewPhoto(src));
            if(choice != null){
                dispatch(setOpenConfirmDialog(true, "Foto telah masuk pada foto pilihan, lanjutan untuk menghapus ?", confirmDialogType.DELETE_CHOICE_PHOTO_AFTER_CHECKOUT))
            }else{
                dispatch(removeSelectedPhoto(src));
                setIsSelectedState(e.target.checked);
                // refreshOriginPhoto();
            }
            

        }



    }

    const handleOpenPicture = (event) => {
        if (event.target.type != "checkbox") {
            // setZoom(true);
            dispatch(updateCurrentPreviewPhoto(src));
            dispatch(openPicturePreview(true));
        }

    }


    return (
        <div id={id} ref={innerRef} data-img-src={src} style={{ position: 'relative' }} onClick={handleOpenPicture}>
            {/* https://lh3.googleusercontent.com/AOBsrWGrYx6PIlkG2PdBCgV_0WORYvyJ3GcZ3z74E81t3xs_kKbunxMErNQKffF0-s4BDS366wSkByk=s190 */}
            {/* https://lh3.googleusercontent.com/d/1DobPY--FVIMLEiLJqKo33epm4MiheZ6L=w190-h190 */}
            {/* https://drive.google.com/thumbnail?id= */}
            <Checkbox
                icon={<RadioButtonUncheckedIcon className={classes.icon} />}
                checkedIcon={<CheckCircleIcon className={classes.icon} />}
                style={{ position: 'absolute', top: '0', right: '0' }}
                checked={isSelectedState}
                onChange={handleSelectedPhoto}
                name="checkedA"
            />
            <div className="flip-entry-visual" style={{ textAlign: 'center' }}>
                <div className="flip-entry-visual-card">
                    <div className="flip-entry-thumb">
                        {/* <img src="https://drive.google.com/thumbnail?id=1DobPY--FVIMLEiLJqKo33epm4MiheZ6L" alt="JPEG Image" /> */}
                        {/* {src === null ? <PanoramaIcon/>: } */}
                        <img src={`https://drive.google.com/thumbnail?id=${src}`} style={{ objectFit: 'contain', height: height, width: width }} alt="JPEG Image" loading="lazy" />
                    </div>
                </div>
                <div className='flip-entry-text'>
                    {filename}
                </div>
            </div>
        </div>
    )
}

export default OriginPhotoPicture;