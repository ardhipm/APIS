import { Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect } from 'react';
import TextDescription from './TextDescription';
import parse from "html-react-parser";

const UserFAQ = () => {

    const [description, setDescription] = React.useState("");

    useEffect(()=>{
        getData()
    },[]);

    const getData =  () => {
        const token = localStorage.getItem('authToken');
        axios.request({
            method: 'get',
            url: '/api/faq/view',
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        }).then(res => {
            let values = res.data.data;
            //console.log('here');
            if(res.data.success){
                setDescription(values[0].faq_description);
            }
        }).catch(error => {
            //console.log(error);
        })
    }
    //console.log(description)

    return (
        <Grid container spacing={2}>
        <Grid item xs={12}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                        Pertanyaan
                    </Typography>
                </Grid>
            </Grid>

        </Grid>
        <Grid item xs={12}>
            <Typography variant="subtitle1" >
                <div dangerouslySetInnerHTML={{ __html: description }}/>
                    {/* {parse(description)} */}
                {/* <TextDescription description={parse(description)}/> */}
            </Typography>
        </Grid>
    </Grid>

    );
}

export default UserFAQ;