import { Icon } from '@iconify/react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';


const useStyles = makeStyles((theme) => ({

    dialogLayout: {
        borderRadius: '8px'
    }

}));


const ZipLoadingPopup = (props) => {


    const classes = useStyles();

    return (
        <Dialog open={props.open} className={classes.dialogLayout} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogContent>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center">
                    <Grid item xs={12}>
                        <CircularProgress  />
                        {/* <Icon icon="bx:bxs-check-circle" style={{ color: '#3AEC1D' }} height={80} width={80} /> */}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" style={{fontWeight: 'bold', marginTop: '20px', marginBottom: '20px'}}>
                            {props.text}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default ZipLoadingPopup;