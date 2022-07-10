import { Button, makeStyles } from '@material-ui/core';
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentPreviewPhoto, showPreviewAlbumPhoto } from '../../../Redux/User/features/albumphoto/albumphoto.action';

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

const AlbumPhotoPreviewPicture = (props) => {
    const classes = useStyles();
    const albumPhotoProps = useSelector((state) => state.albumPhotoReducer);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    // const [errorMsg, setErrorMsg] = useState('failed to load');

    

    useEffect(() => {
        // register key listener
        document.addEventListener('keydown', handleKeyNextPrev)
        return () => {
            document.removeEventListener('keydown', handleKeyNextPrev)
        }
    }, [loading, isSelected ])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyNextPrev)
        return () => {
            document.removeEventListener('keydown', handleKeyNextPrev)
        }
    }, [albumPhotoProps.currentBasenamePreview])

    const handleKeyNextPrev = (e) => {
        if (e.keyCode == 39) {
            let btnNext = document.getElementById("btn-next")
            btnNext.click();
        }
        if (e.keyCode == 37) {
            let btnNPrev = document.getElementById("btn-prev")
            btnNPrev.click();
        }
    
    }

    

    const handleOnClose = (e) => {
        document.removeEventListener('keydown', handleKeyNextPrev)
        if (e.target.id === 'album-photo-preview-layout' 
            || e.target.id === 'album-photo-preview-container'
            || e.target.id === 'btnClose') dispatch(showPreviewAlbumPhoto(false))
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
    

    // const refreshOriginPhoto = () => {
    //     dispatch(resetOriginPhoto());
    //     for (let i = 1; i <= originPhotoProps.pageNumber; i++) {
    //         dispatch(getOriginPhotoWithPagination(originPhotoProps.selectedSubPackageIdx, 1));
    //     }
    // }



    return (
        <>
            <div id="album-photo-preview-layout" className={classes.outterLayout}
                style={albumPhotoProps.showPreview ? { display: 'block' } : { display: 'none' }}
                onClick={handleOnClose}
                // 1E49DRQ6vyxQoz0Ny885B-xL_ESV35sRM
                >
                <Button
                        style={{ position: 'absolute', right: 0, top: 0, padding: '16px', cursor: 'pointer', zIndex: 10000 }}
                        className={classes.btnNav}><Icon id="btnClose" icon="bx:bx-x-circle" style={{ color: 'white', fontSize: '60px' }} /></Button>


                <div id="album-photo-preview-container" className={classes.imgContainer}>
                    {/* {loading && <CircularProgress />} */}
                    {/* {loading && <CircularProgress className={classes.loadingBar} />}
                    {error && 'Failed to load image'} */}
                    <img
                        hidden={loading}
                        onLoad={handleOnLoad}
                        onError={handleImageErrored}
                        src={`https://drive.google.com/thumbnail?id=${albumPhotoProps.currentBasenamePreview}&sz=h1000`}
                        // src={`https://drive.google.com/thumbnail?id=1E49DRQ6vyxQoz0Ny885B-xL_ESV35sRM&sz=h1000`}
                        style={{ objectFit: 'contain', height: '100%',width: '100%' }}
                        alt="JPEG Image"
                        loading="eager" />
                        {albumPhotoProps.photoAlbumData.map((element, index) => {

                            let prevEl = albumPhotoProps.photoAlbumData[index - 1];
                            let nextEl = albumPhotoProps.photoAlbumData[index + 1];

                            if (prevEl === undefined) prevEl = albumPhotoProps.photoAlbumData[albumPhotoProps.photoAlbumData.length - 1];
                            if (nextEl === undefined) nextEl = albumPhotoProps.photoAlbumData[0];

                            if (element.basename === albumPhotoProps.currentBasenamePreview) {
                                return (
                                    <div key={element.basename}>
                                        {/* <span>isSelect : {element.isSelected}</span> */}
                                        <Button
                                            id='btn-prev'
                                            className={classes.prevBtn}
                                            key={1}
                                            onClick={(e) => handlePrevNext(e, prevEl.basename)}
                                            endIcon={<Icon icon="grommet-icons:previous" style={{ color: 'white', fontSize: '60px' }} />}
                                        ></Button>
                                        <Button
                                            id='btn-next'
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
                    }
                    
                </div>
            </div>
        </>
    )
}

export default AlbumPhotoPreviewPicture;