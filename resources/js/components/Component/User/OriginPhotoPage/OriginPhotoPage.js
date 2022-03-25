import { Box, Button, Grid, Tab, Tabs, Typography, CircularProgress, makeStyles } from '@material-ui/core';
import { GetApp, Send } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    getOriginPhoto, 
    getOriginPhotoMetadata, 
    updateSubpackageIdx, 
    resetOriginPhoto, 
    getOriginPhotoWithPagination,
    updatePageNumber,
    countSelectedOriginPhoto,
    updateCurrentPreviewPhoto,
    getDownloadLink,
    setOpenDownloadPopup, 
    checkoutSelectedPhoto} from '../../../Redux/User/features/originphoto/originphoto.action';
import {
    confirmDialogType,
    setOpenConfirmDialog
} from '../../../Redux/User/features/confirmdialog/confirmdialog.action';
import LinkToDrivePopup from '../../Popup/LinkToDrivePopup';
import LoadingSnackbar from './LoadingSnackbar';
import PhotoAlert from './PhotoAlert';
import OriginPhotoPicture from './OriginPhotoPicture';
import OriginPhotoPreviewPicture from './OriginPhotoPreviewPicture';
import ConfirmationDialog from '../../Popup/ConfirmationDialog';
import { setOpenAlertPopup } from '../../../Redux/Popup/Alert/alert.action'; 



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


const OriginPhotoPage = () => {
    // const [tabIndex, setTabIndex] = useState(0);
    const classes = useStyles();
    const dispatch = useDispatch();
    const originPhotoProps = useSelector((state) => state.originPhotoReducer);

    ///////////////////// OBSERVER //////////////////////////////

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
        if(isVisible && originPhotoProps.hasMore) {
            dispatch(updatePageNumber(originPhotoProps.pageNumber + 1));
        }
        
    }, [isVisible])

    useEffect(() => {
        if(originPhotoProps.pageNumber > 1) dispatch(getOriginPhotoWithPagination(originPhotoProps.selectedSubPackageIdx, originPhotoProps.pageNumber ));
    }, [originPhotoProps.pageNumber])

    useEffect(() => {
        const observer = new IntersectionObserver(callbackFunction, options)
        if(theRef.current) observer.observe(theRef.current)
        return() => {
            observer.disconnect();
        }
    }, [theRef, options])

    useEffect(() => {
        // console.log('asdfasdf');
        dispatch(countSelectedOriginPhoto(originPhotoProps.selectedSubPackageIdx));
    }, [originPhotoProps.currentOriginPhoto])

    //////////////////////////////////////////////////////

    useEffect(() => {
        dispatch(getOriginPhotoMetadata());
        dispatch(getDownloadLink('origin'));
        // dispatch(countSelectedOriginPhoto(originPhotoProps.selectedSubPackageIdx));
    }, [])

    useEffect(() => {
        dispatch(resetOriginPhoto())
        dispatch(getOriginPhotoWithPagination(originPhotoProps.selectedSubPackageIdx, originPhotoProps.pageNumber ));
    }, [originPhotoProps.selectedSubPackageIdx]);



    const handleTabChange = (event, newValue) => {
        // setTabIndex(newValue);
        dispatch(updateSubpackageIdx(newValue));
        dispatch(updatePageNumber(1));
        dispatch(countSelectedOriginPhoto(newValue));
    }

    const handleOpenAlert = () => {
        dispatch(setOpenAlertPopup(true, "Anda harus memilih semua foto sampai batas yang telah di tentukan", "error"));
    } 

    const handleDownloadLink = () => {
        // console.log('herer');
        dispatch(setOpenDownloadPopup(true));
    }

    const handleSelectedPhoto = () => {
        if(originPhotoProps.subPackageNumEditPhoto != originPhotoProps.subPackageNumSelectedEditPhoto){
            dispatch(setOpenAlertPopup(true, "Anda harus memilih semua foto sampai batas yang telah di tentukan", "error"));
        }else{
            dispatch(setOpenConfirmDialog(true, "Foto akan masuk pada foto pilihan, lanjutkan ?", confirmDialogType.CHECKOUT_SELECTED_PHOTO));
            
        }
    }

    // const handleOnConfirmDialog = () => {
    //     dispatch(checkoutSelectedPhoto(originPhotoProps.selectedSubPackageIdx));
    //     dispatch(setOpenConfirmDialog(false, originPhotoProps.confirmDialogMessage));
    // }




    return (
        <>
        <Grid container direction='column' spacing={2}>
            {/* {console.log('render')} */}
            <Grid item style={{ position: 'relative' }}>
                <div>
                    <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                        {originPhotoProps.packageTitle}
                    </Typography>
                    {/* <button onClick={() => { console.log(originPhotoProps) }}>click for props</button> */}
                    {/* <button onClick={() => { 
                        dispatch(updateCurrentPreviewPhoto('1aQmXcHZoElIVl6ZvmgLTySfzvU-hSH-a'));
                        setShowPreview(true);
                        }}>show preview</button>
                    <button onClick={handleOpenAlert}>show alert</button> */}
                    {/* <button onClick={handleOpenAlert}>show alert</button> */}
                </div>
                <div>
                    <Typography variant="subtitle1" >
                        Download terlebih dahulu foto pada paket untuk melanjutkan proses pemilihan
                    </Typography>
                </div>
                <div>
                    <Typography variant="subtitle1" >
                        Silahkan pilih foto untuk di edit {originPhotoProps.subPackageNumSelectedEditPhoto}/{originPhotoProps.subPackageNumEditPhoto}
                    </Typography>
                </div>
                <div style={{ position: 'absolute', right: '0', top: '0' }}>
                    {}<Button
                        variant="contained"
                        color="primary"
                        endIcon={<Send />}
                        disabled={originPhotoProps.subPackageNumSelectedEditPhoto < 1 }
                        onClick={handleSelectedPhoto}>
                        Kirim
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: '12px' }}
                        endIcon={<GetApp />}
                        onClick={handleDownloadLink}>
                        Unduh
                    </Button>
                </div>
            </Grid>
            <Grid item  >
                {originPhotoProps.selectedSubPackageIdx > -1 &&
                    <Tabs value={originPhotoProps.selectedSubPackageIdx} onChange={handleTabChange} classes={{ indicator: classes.indicator }} aria-label="simple tabs example">

                        {originPhotoProps.subPackage.length > 0 && originPhotoProps.subPackage.map((value, idx) => {
                            return (<Tab key={value.id} label={<span className={classes.tabLabel}>{value.name}</span>} value={value.id}/>)
                        })}
                    </Tabs>}

            </Grid>
            <Grid item style={ {flex: '11'}}>
                <div style={{ marginTop: '12px'}}>
                    <div id="observeGrid" style={{ display: 'flex', maxHeight: '55vh', flexFlow: 'wrap', overflowX: 'auto', gap: '10px' }}>

                        {/* {originPhotoProps.loading && <CircularProgress />} */}
                        {originPhotoProps.currentOriginPhoto.length < 1 && 'Tidak ada data'} 
                        {originPhotoProps.currentOriginPhoto.map((element, idx) => {
                            // console.log(idx)
                            // console.log(originPhotoProps.currentOriginPhoto.length)
                            if(originPhotoProps.currentOriginPhoto.length === idx+1){
                                return (<OriginPhotoPicture 
                                    id='lastImg' 
                                    innerRef={theRef} 
                                    isSelected={element.is_selected} 
                                    filename={element.filename} 
                                    key={element.id} 
                                    src={element.basename}
                                    choice={element.choice_basename}
                                    />)
                            }else{
                                return (<OriginPhotoPicture 
                                    key={element.id} 
                                    isSelected={element.is_selected} 
                                    filename={element.filename}  
                                    src={element.basename}
                                    choice={element.choice_basename} 
                                    />)
                            }
                            
                            // console.log('-------');
                            // console.log(idx);
                        })}
                        
                        
                        
                    </div>
                    

                    {/* <div> disni aja brayyyy3</div> */}
                    {/* https://drive.google.com/file/d/1GwKLjjaS1f01i_Fo5B2uBn1v9nqqd4Xi/view */}
                    {/* { https://drive.google.com/file/d/1GwKLjjaS1f01i_Fo5B2uBn1v9nqqd4Xi/view?usp=sharing } */}
                    {/* { https://drive.google.com/uc?export=view&id=1GwKLjjaS1f01i_Fo5B2uBn1v9nqqd4Xi } */}
                    {/* <iframe src="https://drive.google.com/embeddedfolderview?id=1YVbiY0nM2Vcx69UgPkmYvuJJ4pkYbxVn#grid" style={{width:'100%', height:'600px', border:0}} onClick={handleIframeClick}></iframe> */}
                    {/* <iframe src="https://drive.google.com/uc?export=view&id=1GwKLjjaS1f01i_Fo5B2uBn1v9nqqd4Xi" style={{width:'100%', height:'600px', border:0}} onClick={handleIframeClick}></iframe> */}
                    {/*https://drive.google.com/drive/u/2/folders/1-TQeeoMSROLz_3nBtil-DeZ0aV5ZmQlP */}
                    {/* https://drive.google.com/embeddedfolderview?id=1-TQeeoMSROLz_3nBtil-DeZ0aV5ZmQlP#grid */}
                </div>
                <div style={{ textAlign: 'center'}}>
                { originPhotoProps.loading && <CircularProgress />}
                </div>
            </Grid>
        </Grid>
        <OriginPhotoPreviewPicture/>
        <PhotoAlert />
        <LoadingSnackbar />
        <LinkToDrivePopup />
        <ConfirmationDialog />
        </>
        
    )
}

export default OriginPhotoPage;
