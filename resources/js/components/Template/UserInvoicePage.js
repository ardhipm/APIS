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
    const [isPaid, setIsPaid] = React.useState("");

    useEffect(() => {
        getInvoicePhoto()
        
    },[]);

    const driveApiLink = (value) => {
        // return 'drive.google.com/thumbnail?export=view&sz=w600&id=' + value;
        // return 'lh3.google.com/u/6/d/'+value+'=w600'
        // return 'https://lh3.googleusercontent.com/d/'+value+'=w600?authuser=0'
        return `https://drive.google.com/file/d/${value}/preview`;
    }

    
    

    const getInvoicePhoto = () => {

        const token = localStorage.getItem('authToken');
        axios.request({
            method: "get",
            url: "/api/invoice/view_customer",
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        }).then(res => {
            let values = res.data.data;
            // console.log(values)
            if(values.invoice_link.length < 1){
                setDescMessage("Kamu belum memiliki tagihan");
                setIsPaid("Belum Bayar");

            }else{
                setDescMessage("Silahkan selesaikan pembayaranmu ya!");
                //console.log(values)
                setInvoicePic(values.invoice_link);
                setIsPaid("Sudah Bayar");
            }
        }).catch(error => {
            //console.log(error);
            //console.log('error here');
        })
    }

    const statusBayar = isPaid;

    

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
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" >
                                    Status Pembayaran : {statusBayar}
                                </Typography>
                            </Grid>
                        </Grid>

                    </Grid>

                </Grid>
            </Grid>
            <Grid className={classes.containerLayout} item xs={12}>
                {/* <img className={classes.imgLayout} src={invoicePic.length > 1 ? driveApiLink(invoicePic): null} />  */}
                <iframe style={{width : '100%', height: '70vh'}} src={invoicePic.length > 1 ? driveApiLink(invoicePic): null} />
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