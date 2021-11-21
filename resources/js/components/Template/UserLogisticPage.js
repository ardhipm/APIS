import { Box, Button, Container, Grid, makeStyles, Popover, Typography } from '@material-ui/core';
import { fontWeight } from '@material-ui/system';
import { Icon } from '@iconify/react';
import React, { useEffect } from 'react';
import BasicPopover from '../Component/Popup/BasicPopover';
import axios from 'axios';



const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 20 + 'px',
        fontWeight: 'bold'
    },
    bgIcon: {

        backgroundColor: 'black',
        height: '100%',
        width: '100%',
        borderRadius: 8 + 'px',

        '&:hover': {
            backgroundColor: 'none'
        }
    },
    imgLayout: {
        maxWidth: 900 + 'px'

    }
}));

let initialData = {
    idPelanggan: null,
    tglPesanan: null,
    noResi: null,
    link: null,
    basename: null,
}


const UserLogisticPage = () => {

    const [logisticData, setLogisticData] = React.useState({});
    const [showCopyPopover, setShowCopyPopover] = React.useState(false);
    const [popoverDescription, setPopoverDescription] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [data, setData] = React.useState({});

    useEffect(() => {

        getShipmentData();
        // setData(prevState => {
        //     return {
        //         ...prevState,
        //         idPelanggan: 1,
        //         tglPesanan: "20 September 2021",
        //         // noResi: 1234554321,
        //         link: "www.google.com"
        //     }
        // })

    }, [])


    const getShipmentData = () => {

        const token = localStorage.getItem('authToken');
        axios.request({
            method: "get",
            url: "/api/shipment/view",
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        }).then(res => {
            let values = res.data.data;
            if (res.data.success == true) {

                setData(prevState => {
                    return {
                        ...prevState,
                        idPelanggan: values.id_customer,
                        tglPesanan: values.updated_at,
                        noResi: values.receipt_no,
                        link: values.receipt_link,
                        basename: values.shipment_photo_link
                    }
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }



    const classes = useStyles();

    function handleCopy(e) {
        //console.log(e.currentTarget.id);

        if (e.currentTarget.id === "btnLink") {
            setPopoverDescription("Alamat Link Tersalin");
            let textPelacakan = document.getElementById('linkPelacakan').innerHTML;
            copyToClipboard(textPelacakan);

        } else if (e.currentTarget.id === "btnResi") {
            setPopoverDescription("Nomer Resi Tersalin");
            let textResi = document.getElementById('noResi').innerHTML;
            copyToClipboard(textResi);
        }
        setAnchorEl(e.currentTarget);
    }


    const handleClosePopover = () => {
        setAnchorEl(null);
    }

    // const copyToClipboard = (value) => {
    //     navigator.clipboard.writeText(value);
    // }

    // return a promise
    function copyToClipboard(textToCopy) {
        // navigator clipboard api needs a secure context (https)
        if (navigator.clipboard && window.isSecureContext) {
            // navigator clipboard api method'
            return navigator.clipboard.writeText(textToCopy);
        } else {
            // text area method
            let textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            // make the textarea out of viewport
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((res, rej) => {
                // here the magic happens
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
            });
        }
    }

    const driveApiLink = (value) => {
        return 'https://drive.google.com/uc?export=view&id=' + value;
    }

    const renderPhoto = data.basename == null ? "Foto bukti belum tersedia" : <img className={classes.imgLayout} src={driveApiLink(data.basename)} />;

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={6}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                                    Konfirmasi Pesanan
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" >
                                    Halo, Terima kasih atas pesanannya. Anda dapat melacak status pesanan anda di situs yang kami berikan di bawah ini
                                </Typography>
                            </Grid>
                        </Grid>

                    </Grid>

                </Grid>
            </Grid>
            <Grid className={classes.containerLayout} item xs={12}>
                <Grid container spacing={3}>
                    <Grid item >
                        <Box>
                            <Typography className={classes.title}>
                                ID Pelanggan
                            </Typography>
                            <Typography >
                                {data.idPelanggan}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box >
                            <Typography className={classes.title}>
                                Tanggal Pesanan
                        </Typography>
                            <Typography >
                                {data.tglPesanan}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item >
                        <Box display="flex" flexWrap="wrap">
                            <Box>
                                <Typography className={classes.title}>
                                    No. Resi
                                </Typography>
                                <Typography id="noResi">
                                    {data.noResi != null && data.noResi.length > 0 ? data.noResi : "Resi belum tersedia"}
                                </Typography>
                            </Box>

                            <Box style={{ marginLeft: 8 + 'px', padding: '4px' }}>
                                {data.noResi != null && data.noResi.length > 0 ? (<Button
                                    id="btnResi"
                                    className={classes.bgIcon}
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                    disableTouchRipple={true}
                                    variant="outlined"
                                    onClick={handleCopy}>
                                    <Icon icon="bx:bx-copy" style={{ color: 'white', fontSize: "24px" }} />
                                </Button>) : null}
                            </Box>
                        </Box>

                    </Grid>
                    <Grid item >
                        <Box display="flex" flexWrap="wrap">
                            <Box >
                                <Typography className={classes.title}>
                                    Link Pelacakan
                                </Typography>
                                <Typography id="linkPelacakan">
                                    {data.link != null && data.link.length > 0 ? data.link : "Link belum tersedia"}
                                </Typography>
                            </Box>
                            <Box style={{ marginLeft: 8 + 'px', padding: '4px' }}>
                                {data.link != null && data.link.length > 0 ? (<Button
                                    id="btnLink"
                                    className={classes.bgIcon}
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                    disableTouchRipple={true}
                                    variant="outlined"
                                    onClick={handleCopy}>
                                    <Icon icon="bx:bx-copy" style={{ color: 'white', fontSize: "24px" }} />
                                </Button>) : null}

                            </Box>

                        </Box>
                    </Grid>

                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography className={classes.title} variant="subtitle2" >
                    Bukti Barang Pengiriman
                </Typography>
                <div>
                    {renderPhoto}
                </div>


            </Grid>
            <BasicPopover
                description={popoverDescription}
                anchorEl={anchorEl}
                handleClosePopover={handleClosePopover} />
        </Grid>
    );
}

export default UserLogisticPage;