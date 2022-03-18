import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, Typography } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import { getDownloadLink, setOpenDownloadPopup } from '../../Redux/User/features/originphoto/originphoto.action';
import { useDispatch, useSelector } from 'react-redux';


const useStyles = makeStyles((theme) => ({
    dialogLayout: {
        borderRadius: '8px'
    },

}));

const LinkToDrivePopup = () => {
    const classes = useStyles();

    const originPhotoProps = useSelector((state) => state.originPhotoReducer);
    const dispatch = useDispatch();
    // const [data, setData] = React.useState(props.data);

    
    useEffect(() => {
        // setData(props.data);
        // console.log('linktoprop')
    },[originPhotoProps.openDownloadPopup]);

    const handleClose = () => {
        dispatch(setOpenDownloadPopup(false));
    }

    return(
        <Dialog open={originPhotoProps.openDownloadPopup} className={classes.dialogLayout} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogContent>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center">
                    <Grid item xs={12}>
                        <GetApp style={{height:'80px', width:'80px'}}/>
                        {/* <Icon icon="akar-icons:circle-alert-fill" style={{ color: 'red' }} height={80} width={80} /> */}
                    </Grid>
                    <Grid item xs={12} >
                        <Typography variant="h6" style={{fontWeight: 'bold'}}>
                            Pilih salah satu link untuk menuju ke link download
                        </Typography>
                        <Typography style={{display: 'flex', flexFlow: 'column'}}>
                            <a href={'https://'+originPhotoProps.parentFolderLink} target="_blank">{originPhotoProps.parentFolderName}</a>
                            {originPhotoProps.downloadChild.map((element, idx) => {
                                let link = 'https://'+element.child_link;
                                let foldername = element.child_folder_name;
                                return <a 
                                    key={element.child_link}  
                                    href={link} target="_blank" 
                                    data-sub-name={element.name} 
                                    data-idx={idx}>
                                        {foldername}
                                    </a>
                            })}
                            {/* {data.child != undefined && data.child.map((element, idx) => {
                                
                            })} */}
                            
                            {/* <a href="https://www.google.com" target="_blank">Sub Folder 2</a> */}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            {/* <DialogActions>
                <Button  variant="contained" color="primary" fullWidth style={{textTransform : 'capitalize'}}>
                    Ok
                </Button>
            </DialogActions> */}
        </Dialog>
    )

}

export default LinkToDrivePopup;