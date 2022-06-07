import { Button, Grid, LinearProgress, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { GetApp, Send } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getChoicePhotoMetadata,
    getChoicePhotoWithPagination,
    updateSubpackageIdx,
    resetChoicePhoto,
    updatePageNumber,
    countSelectedAlbumPhoto,
    countSelectedPrintPhoto
} from '../../../Redux/User/features/choicephoto/choicephoto.action';
import{ 
    setOpenDownloadPopup,
    getDownloadLink,
    getSubpackage
} from '../../../Redux/User/features/originphoto/originphoto.action';
import {
    setOpenAlertPopup
} from '../../../Redux/Popup/Alert/alert.action';
import {
    confirmDialogType,
    setOpenConfirmDialog
} from '../../../Redux/User/features/confirmdialog/confirmdialog.action';
import { setOpenLoadingPopup } from '../../../Redux/Popup/Loading/loading.action';
import ChoicePhotoPicture from './ChoicePhotoPicture';
import ChoicePhotoPreveiwPicture from './ChoicePhotoPreviewPicture';
import PhotoAlert from '../OriginPhotoPage/PhotoAlert';
import LinkToDrivePopup from '../../Popup/LinkToDrivePopup';
import LoadingSnackbar from '../OriginPhotoPage/LoadingSnackbar';
import ConfirmationDialog from '../../Popup/ConfirmationDialog';


const useStyles = makeStyles((theme) => ({
    tabLabel: {
        textTransform: 'capitalize',
        fontWeight: 'bold'

    },
    indicator: {
        backgroundColor: '#7DB9E0'
    },
    hidden: {
        display: 'none'
    },
    iconAlbumSelected: {
        color: '#FB9300',
        marginRight: '0.3em'
    },
    iconPrintSelected: {
        color: '#F54748',
        marginRight: '0.3em'
    }
}));

const ChoicePhotoPage = () => {

    const classes = useStyles();

    const choicePhotoProps = useSelector((state) => state.choicePhotoReducer);
    const dispatch = useDispatch();
    const test = true;


    //////////// OBSERVER //////////////////////

    const theRef = useRef(null)
    // const [pageNumber, setPageNumber] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.8
    }

    const callbackFunction = (entries) => {
        const [entry] = entries
        setIsVisible(entry.isIntersecting)
    }

    useEffect(() => {
        if (isVisible && choicePhotoProps.hasMore) {
            dispatch(updatePageNumber(choicePhotoProps.pageNumber + 1));
        }

    }, [isVisible])

    useEffect(() => {
        if (choicePhotoProps.pageNumber > 1) dispatch(getChoicePhotoWithPagination(choicePhotoProps.selectedSubPackageIdx, choicePhotoProps.pageNumber));
    }, [choicePhotoProps.pageNumber])

    useEffect(() => {
        const observer = new IntersectionObserver(callbackFunction, options)
        if (theRef.current) observer.observe(theRef.current)
        return () => {
            observer.disconnect();
        }
    }, [theRef, options])

    useEffect(() => {
        // console.log('asdfasdf');
        // dispatch(countSelectedOriginPhoto(choicePhotoProps.selectedSubPackageIdx));
    }, [choicePhotoProps.currentChoicePhoto])


    ////////////////////////////////////////////

    useEffect(async() => {
        let test = await dispatch(getChoicePhotoMetadata());
        if (test != null) {
            dispatch(countSelectedAlbumPhoto(choicePhotoProps.selectedSubPackageIdx));
            dispatch(countSelectedPrintPhoto(choicePhotoProps.selectedSubPackageIdx));
        }
        
        dispatch(getDownloadLink('choice'));
    }, [])

    // useEffect(() => {
    // if(choicePhotoProps.pageNumber > 1) dispatch(getOriginPhotoWithPagination(originPhotoProps.selectedSubPackageIdx, originPhotoProps.pageNumber ));
    // }, [choicePhotoProps.pageNumber])


    useEffect(() => {

    }, [choicePhotoProps.packageTitle]);

    useEffect(() => {
        dispatch(resetChoicePhoto())
        dispatch(getChoicePhotoWithPagination(choicePhotoProps.selectedSubPackageIdx, choicePhotoProps.pageNumber));
        dispatch(countSelectedAlbumPhoto(choicePhotoProps.selectedSubPackageIdx))
        dispatch(countSelectedPrintPhoto(choicePhotoProps.selectedSubPackageIdx))
    }, [choicePhotoProps.selectedSubPackageIdx])

    useEffect(() => {

    }, [choicePhotoProps.totalSelectedAlbumPhoto, choicePhotoProps.totalSelectedPrintPhoto])

    const handleTabChange = (event, tabValue) => {
        dispatch(updateSubpackageIdx(tabValue));
        dispatch(getSubpackage(tabValue))
        
        dispatch(updatePageNumber(1));
    }

    const handleSubmit = () => {
        if (choicePhotoProps.totalSelectedAlbumPhoto != choicePhotoProps.totalLimitAlbumPhoto ||
            choicePhotoProps.totalSelectedPrintPhoto != choicePhotoProps.totalLimitPrintPhoto) {
            dispatch(setOpenAlertPopup(true, "Anda belum memilih semua foto sampai batas yang telah di tentukan", "error"));
        } else {
            // dispatch(setOpenConfirmDialog(true, "Foto akan masuk pada foto pilihan, lanjutkan ?", confirmDialogType.CHECKOUT_SELECTED_PHOTO));
            dispatch(setOpenConfirmDialog(true, "Foto yang telah dikirim sebagai foto album dan foto cetak tidak akan bisa dihapus kembali, lanjutkan ?", confirmDialogType.CHECKOUT_ALBUM_PRINT_PHOTO));

        }
    }

    const handleDownloadLink = () => {
        dispatch(setOpenDownloadPopup(true));
    }

    return (
        <>
            {
                choicePhotoProps.loadingMetadata ?
                    <LinearProgress style={{ width: '40%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} /> :
                    <Grid container direction='column' spacing={2}>
                        <Grid item style={{ position: 'relative' }}>
                            <div>
                                <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                                    {choicePhotoProps.packageTitle}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="subtitle1" >

                                </Typography>
                            </div>
                            <div>
                                {/* <button onClick={() => { console.log(choicePhotoProps) }}>print props</button> */}
                                <Typography variant="subtitle1" >

                                    Silahkan pilih foto untuk dijadikan <strong>Album</strong> dan untuk <strong>Cetak</strong><br />
                                    Foto Album Terpilih {choicePhotoProps.totalSelectedAlbumPhoto}/{choicePhotoProps.totalLimitAlbumPhoto} <br />
                                    Foto Cetak Terpilih {choicePhotoProps.totalSelectedPrintPhoto}/{choicePhotoProps.totalLimitPrintPhoto}
                                </Typography>
                            </div>
                            <div style={{ position: 'absolute', right: '0', top: '0' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    endIcon={<Send />}
                                    disabled={choicePhotoProps.totalSelectedAlbumPhoto < 1 && choicePhotoProps.totalSelectedPrintPhoto < 1}
                                    onClick={handleSubmit}
                                >
                                    Kirim
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginLeft: '12px' }}
                                    endIcon={<GetApp />}
                                    onClick={handleDownloadLink}
                                >
                                    Unduh
                                </Button>
                            </div>
                        </Grid>
                        <Grid item  >
                            {choicePhotoProps.selectedSubPackageIdx > -1 &&
                                <Tabs value={choicePhotoProps.selectedSubPackageIdx}
                                    onChange={handleTabChange}
                                    classes={{ indicator: classes.indicator }}
                                    aria-label="simple tabs example">

                                    {choicePhotoProps.subPackage.length > 0 && choicePhotoProps.subPackage.map((value, idx) => {
                                        return (<Tab key={value.id} label={<span className={classes.tabLabel}>{value.name}</span>} value={value.id} />)
                                    })}
                                </Tabs>}

                        </Grid>
                        <Grid item style={ {flex: '11'}}>
                            <div style={{ marginTop: '12px' }}>
                            <div id="observeGrid" style={{ display: 'flex', maxHeight: '55vh', flexFlow: 'wrap', overflowX: 'auto', gap: '5px' }}>
                                    {/* <ChoicePhotoPicture src="1WYAb1Ui0V6pf9a_bHeQL7tLZopDp-0AU" isEdited={0}/>
                                    <ChoicePhotoPicture src="1qzqMN9sfA9gSOEKJ_Jd4-PkPiX8-LE_T" isEdited={1}/> */}
                                    {choicePhotoProps.currentChoicePhoto.length < 1 && 'Tidak ada data'}
                                    {choicePhotoProps.currentChoicePhoto.map((element, idx) => {
                                        // console.log(idx)
                                        // console.log(originPhotoProps.currentOriginPhoto.length)
                                        if (choicePhotoProps.currentChoicePhoto.length === idx + 1) {
                                            return (<ChoicePhotoPicture
                                                id='lastImg'
                                                innerRef={theRef}
                                                idx={idx}
                                                // isSelected={element.is_selected}
                                                isAlbumSelected={element.is_album_selected}
                                                isPrintSelected={element.is_print_selected}
                                                isEdited={element.is_edited}
                                                filename={element.filename}
                                                albumBasename={element.album_basename}
                                                printBasename={element.print_basename}
                                                key={element.id}
                                                src={element.basename}
                                                choice={element.choice_basename}
                                            />)
                                        } else {
                                            return (<ChoicePhotoPicture
                                                idx={idx}
                                                isAlbumSelected={element.is_album_selected}
                                                isPrintSelected={element.is_print_selected}
                                                filename={element.filename}
                                                isEdited={element.is_edited}
                                                albumBasename={element.album_basename}
                                                printBasename={element.print_basename}
                                                key={element.id}
                                                src={element.basename}
                                                choice={element.choice_basename}
                                            />)
                                        }

                                        // {/* // console.log('-------');
                                        console.log(idx);
                                    })}

                                </div>


                            </div>
                            <div style={{ textAlign: 'center' }}>

                            </div>
                        </Grid>
                    </Grid>
            }
            {choicePhotoProps.showPreview && <ChoicePhotoPreveiwPicture />}
            <PhotoAlert />
            <LinkToDrivePopup />
            <LoadingSnackbar />
            <ConfirmationDialog />

        </>
    )
}

export default ChoicePhotoPage;