import { Icon } from '@iconify/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    dialogLayout: {
        borderRadius: '8px'
    },

}));


const TermsDialog = (props) => {

    const classes = useStyles();
    const [description, setDescription] = React.useState("");

    useEffect(()=>{
        getData()
    },[]);

    const getData =  () => {
        const token = localStorage.getItem('authToken');
        axios.request({
            method: 'get',
            url: '/api/term/view',
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        }).then(res => {
            let values = res.data.data;
            //console.log('here');
            if(res.data.success){
                setDescription(values[0].term_description);
            }
        }).catch(error => {
            //console.log(error);
        })
    }
    return (
        <Dialog open={props.open} className={classes.dialogLayout} aria-labelledby="form-dialog-title" maxWidth="xl">
            <DialogContent>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center">
                   
                    <Grid item xs={12}>
                        <Typography style={{ marginTop: '40px', marginBottom: '40px'}}>
                            <div dangerouslySetInnerHTML={{ __html: description }}/>
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} variant="contained" color="primary" fullWidth style={{textTransform : 'capitalize'}}>
                    Oke
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TermsDialog;