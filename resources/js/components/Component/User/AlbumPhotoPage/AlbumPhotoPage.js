import { Grid, Tab, Tabs, Typography, makeStyles, LinearProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { getAlbumPhoto } from '../../../Redux/User/features/albumphoto/albumphoto.action';
import { useDispatch, useSelector } from 'react-redux';

import AlbumPhotoPreviewPicture from './AlbumPhotoPreviewPicture';
import AlbumPhotoPicture from './AlbumPhotoPicture';


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

const AlbumPhotoPage = () =>  {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = useState(0);
    const albumPhotoProps = useSelector((state) => state.albumPhotoReducer);

    useEffect( () => {
        dispatch(getAlbumPhoto('Album1'));
    }, [])

    useEffect(()=>{}, [albumPhotoProps.loading]);
    useEffect(()=>{},[albumPhotoProps.albumPhotoData]);


    const handleTabChange = (e, v) => {
        setTabValue(v);
        dispatch(getAlbumPhoto(v == 0 ? 'Album1': 'Album2'));
    }

    return (
        <>
            <Grid container direction='column' spacing={2}>
            {/* {console.log('render')} */}
            <Grid item style={{ position: 'relative' }}>
                <div>
                    <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                        {/* {originPhotoProps.packageTitle} */}
                        Album
                    </Typography>
                </div>
                <div>
                    <Typography variant="subtitle1" >
                        Anda dapat melihat album yang telah muncul
                    </Typography>
                </div>
            </Grid>
            <Grid item >
                <Tabs aria-label="simple tabs example" value={tabValue} onChange={handleTabChange} classes={{ indicator: classes.indicator }}>

                    <Tab key="1"  label={<span className={classes.tabLabel} value="Album1">Album 1</span>}/>
                    <Tab key="2" label={<span className={classes.tabLabel} value="Album2">Album 2</span>}/>
                    
                </Tabs>

            </Grid>
            <Grid item style={ {flex: '11'}}>
                {albumPhotoProps.loading ? <LinearProgress style={{ width: '40%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} /> : ''}
                <div style={{ marginTop: '12px'}}>
                    <div id="observeGrid" style={{ display: 'flex', maxHeight: '55vh', flexFlow: 'wrap', overflowX: 'auto', gap: '10px' }}>
                    
                        {/* {JSON.stringify(albumPhotoProps.albumPhotoData)} */}
                        {albumPhotoProps.photoAlbumData.map((e, idx) => {
                            return (<AlbumPhotoPicture 
                                key={idx}
                                idx={idx}
                                src={e.basename} 
                                filename={e.filename} />)
                        })}


                        
                        
                    </div>
                </div>
                <div style={{ textAlign: 'center'}}>
                    
                {/* { originPhotoProps.loading && <CircularProgress />} */}
                </div>
            </Grid>
        </Grid>
        <AlbumPhotoPreviewPicture />
        
        
        </>
    )
}

export default AlbumPhotoPage;