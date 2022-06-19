import React from 'react';
import {  makeStyles } from '@material-ui/core';

import { updateCurrentPreviewPhoto, showPreviewAlbumPhoto } from '../../../Redux/User/features/albumphoto/albumphoto.action';
import { useDispatch } from 'react-redux';

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

const AlbumPhotoPicture = ({ id, src, filename, idx }) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    
    const height = '150px';
    const width = '150px';

    const handleOpenPicture = (event) => {
        dispatch(updateCurrentPreviewPhoto(src));
        dispatch(showPreviewAlbumPhoto(true));
    }

    return (
        <div id={id} data-img-src={src} style={{ position: 'relative' }} onClick={handleOpenPicture}>
            <div className="flip-entry-visual" style={{ textAlign: 'center' }}>
                <div className="flip-entry-visual-card">
                    <div className="flip-entry-thumb">
                        <img src={`https://drive.google.com/thumbnail?id=${src}`} style={{ objectFit: 'contain', height: height, width: width }} alt="JPEG Image" loading="lazy" />
                        {/* <img src={`https://drive.google.com/thumbnail?id=1DobPY--FVIMLEiLJqKo33epm4MiheZ6L`} style={{ objectFit: 'contain', height: height, width: width }} alt="JPEG Image" loading="lazy" /> */}
                        
                    </div>
                </div>
                <div className='flip-entry-text'>
                    {filename}
                </div>
            </div>
        </div>
    )
}

export default AlbumPhotoPicture;