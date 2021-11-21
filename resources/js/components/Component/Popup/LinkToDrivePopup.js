import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, Typography } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
    dialogLayout: {
        borderRadius: '8px'
    },

}));

const LinkToDrivePopup = (props) => {
    const classes = useStyles();

    const [data, setData] = React.useState(props.data);

    
    useEffect(() => {
        console.log(data)
        setData(props.data);
    },[props.data])

    return(
        <Dialog open={props.open} className={classes.dialogLayout} onClose={props.handleClose} aria-labelledby="form-dialog-title">
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
                            <a href={"https://drive.google.com/drive/folders/"+data.parent_basename+"?usp=sharing"} target="_blank">{data.parent_filename}</a>
                            {data.child != undefined && data.child.map((element, idx) => {
                                let link = "https://drive.google.com/drive/folders/"+element.basename+"?usp=sharing";
                                let foldername = element.name;
                                return <a key={idx} href={link} target="_blank" onClick={props.handleClose}>{foldername}</a>
                            })}
                            
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