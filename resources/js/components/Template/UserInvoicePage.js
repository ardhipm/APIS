import { Button, Container, Grid, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect } from 'react';
// import image from '../../public/img/struk.png';




const useStyles = makeStyles((theme) => ({
    containerLayout: {
        textAlign: 'center'
    },
    imgLayout: {
        maxWidth: 900+'px'
        
    },
    btnLayout: {
        width: 100 + '%'
    }

}));


const EmptyInvoice =() =>{
    return 
}

const UserInvoicePage = () => {

    const classes = useStyles();
    const [descMessage, setDescMessage] = React.useState("");
    const [invoicePic, setInvoicePic] =React.useState("");

    useEffect(() => {
        getInvoicePhoto()
        
    },[]);

    const driveApiLink = (value) => {
        return 'https://drive.google.com/uc?export=view&id=' + value;
    }

    
    

    const getInvoicePhoto = () => {

        const token = localStorage.getItem('authToken');
        axios.request({
            method: "get",
            url: "/api/invoice/get_photo",
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        }).then(res => {
            let values = res.data.data;
            if(values.length < 1){
                setDescMessage("Kamu belum memiliki tagihan");

            }else{
                setDescMessage("Silahkan selesaikan pembayaranmu ya!");
                //console.log(values)
                setInvoicePic(values[0].basename);
            }
        }).catch(error => {
            //console.log(error);
            //console.log('error here');
        })
    }

    

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={6}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                                    Struk Pembayaran
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" >
                                    {descMessage}
                                </Typography>
                            </Grid>
                        </Grid>

                    </Grid>

                </Grid>
            </Grid>
            <Grid className={classes.containerLayout} item xs={12}>
                <img className={classes.imgLayout} src={invoicePic.length > 1 ? driveApiLink(invoicePic): null} /> 
            </Grid>
            <Grid item xs={12}>
{/*                 
                {invoicePic.length > 1? <Button className={classes.btnLayout} variant="contained" color="primary" >
                    Unduh
                </Button> : null} */}
                
            </Grid>
        </Grid>
    );
}

export default UserInvoicePage;