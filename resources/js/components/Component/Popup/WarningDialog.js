import { Icon } from '@iconify/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';


const useStyles = makeStyles((theme) => ({
    dialogLayout: {
        borderRadius: '8px'
    },

}));

const WarningDialog = (props) => {

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
                        <Icon icon="akar-icons:circle-alert-fill" style={{ color: 'yellow' }} height={80} width={80} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" style={{fontWeight: 'bold', marginTop: '40px', marginBottom: '40px'}}>
                            {props.text}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} variant="contained" color="primary" fullWidth style={{textTransform : 'capitalize'}}>
                    Kembali
                </Button>
                {props.showConfirmButton && <Button onClick={props.handleConfirm} variant="contained" color="primary" fullWidth style={{textTransform : 'capitalize'}} >
                    Ya
                </Button>}
            </DialogActions>
        </Dialog>
    );
}

export default WarningDialog;