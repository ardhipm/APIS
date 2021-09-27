import { Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect } from 'react';
import TextDescription from './TextDescription';

const UserTermsConditionPage = () => {

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
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                            Syarat dan Ketentuan
                        </Typography>
                    </Grid>
                </Grid>

            </Grid>
            <Grid item xs={12}>
               <TextDescription description={description}/>
            </Grid>
        </Grid>

    );
}

export default UserTermsConditionPage;