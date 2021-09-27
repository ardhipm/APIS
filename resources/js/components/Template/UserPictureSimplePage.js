import React, { useEffect } from 'react';
import { Backdrop, Box, Button, CardMedia, CircularProgress, Container, Grid, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { GetApp, PictureAsPdfSharp, Send } from '@material-ui/icons';
import PhotoImage from '../Component/PhotoImage/PhotoImage';
import { Provider } from 'react-redux';
import PhotoZoom from '../Component/PhotoImage/PhotoZoom';
import axios from 'axios';
import ZipLoadingPopup from '../Component/Popup/ZipLoadingPopup';




const useStyles = makeStyles((theme) => ({
    tabLabel: {
        textTransform: 'capitalize',
        fontWeight: 'bold'

    },
    indicator: {
        backgroundColor: '#7DB9E0'
    },
    hidden: {
        display: 'none'
    },
    loading: {
        margin: 'auto'
    }
}));



const data = () => {

    const datas = [];
    for (let i = 0; i < 4; i++) {
        if (i % 2 == 1) {
            datas.push({ idx: i, img: 'img' + i, selected: true });
        } else {

            datas.push({ idx: i, img: 'img' + i, selected: false });
        }
        // imageComponent.push(<PhotoImage key={i} name={'test' + i} value={pictures[i].img} selected={pictures.selected} onSelectedImage={selectImage} />)
    }
    return datas;
}



const UserPictureSimplePage = (props) => {
    const classes = useStyles();

    // const [data, setData] = React.useState('');

    let wayae = data;

    const [value, setValue] = React.useState(0);
    const [pictures, setPictures] = React.useState([]);
    const [size, setSize] = React.useState(0);
    const [zoom, setZoom] = React.useState(false);
    const [loadingData, setLoadingData] = React.useState(false);
    const [zipLoading, setZipLoading] = React.useState(false);

    useEffect(() => {
        setLoadingData(true);
        getData(props.apiLink);
    }, []);

    let getData = (apiLink) => {
        const token = localStorage.getItem('authToken');

        axios.request({
            method: 'get',
            url: apiLink,
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        })
            .then(res => {
                // //console.log(JSON.stringify(res.data.data));
                let arraysData = [];
                for (let i = 0; i < res.data.data.length; i++) {
                    let pic = res.data.data[i];
                    let arrayElement = {
                        idx: pic.timestamp,
                        img: pic.basename,
                        selected: false
                    }
                    arraysData.push(arrayElement);

                }
                //console.log(arraysData);
                setPictures(arraysData);

                setLoadingData(false);

            })
            .catch(error => {
                setLoadingData(false);
                console.log(error);
            })
    }

    const onClickImage = (event) => {
        event.preventDefault();
        if (event.target.type != "checkbox") {
            setZoom(true);
        }

    }

    const onDownload = () => {
        setZipLoading(true);

        const token = localStorage.getItem('authToken');


        let type = null;
        if(props.tabValue == 0){
            type = "origin"
        }else if(props.tabValue ==2){
            type = "final"
        }
        axios.request({
            method: 'post',
            url: "/api/drive/download_video/",
            headers: { 'Authorization': 'Bearer ' + token },
            responseType: 'blob'
        })
            .then(res => {

                setTimeout(() => {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download','video.zip'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                    setZipLoading(false);
                }, 2000);


            })
            .catch(error => {
                console.log(error);
                setZipLoading(false);
            })
    }

    const selectImage = (idx, name, value, isSelected, e) => {
        // let wayae = pictures;
        pictures[idx].selected = isSelected;
        setPictures(wayae);
    }
    const onKirim = () => {
        // //console.log(pictures);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleZoomOut = () => {
        setZoom(false);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={6}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                                    {props.pageName}
                                        </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" >
                                    {props.pageName.toLowerCase() === "video" ? 
                                    "Anda dapat mengunduh "+props.pageName.toLowerCase()+" yang telah tersedia.":
                                    "Anda dapat melihat album yang telah muncul"}
                                    
                                        </Typography>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid item xs={6} align="right" >
                        <Container>
                            {props.pageName.toLowerCase() === "video" && 
                            <Button variant="contained" color="primary" endIcon={<GetApp />} onClick={onDownload}>
                                Unduh
                            </Button>}
                        </Container>

                    </Grid>

                </Grid>
                <Grid container></Grid>
                <Grid container></Grid>
            </Grid>


            <Grid item xs={12}>
                <div value={value} index={0} className={value !== 0 ? classes.hidden : ''} >
                    <Box p={3}>
                        <Grid container spacing={2}>

                            {pictures.length < 1 ? <div>Tidak terdapat data</div> :
                                pictures.map((picture) =>
                                    <PhotoImage
                                        key={picture.idx}
                                        idx={picture.idx}
                                        value={picture.img}
                                        formatGrid={4}
                                        selectedPicture={false}
                                        selected={picture.selected}
                                        onSelectedImage={selectImage}
                                        onClickImage={onClickImage} />
                                )}
                        </Grid>
                    </Box>

                </div>
            </Grid>
            {props.pageName.toLowerCase() !== "video"?<PhotoZoom photoSrc={"ulala"}  isZoom={zoom} onClose={handleZoomOut} /> : null}
            <Backdrop style={{ zIndex: 1000, color: '#fff', }}
                open={loadingData} >
                <CircularProgress color="inherit" />
            </Backdrop>
            <ZipLoadingPopup 
                open={zipLoading} 
                // handleClose={handleCloseWarningPopup} 
                // handleConfirm={submitPhoto}
                text="Mohon menunggu sedang membuat zip file..." />

        </Grid>
    );
}

export default UserPictureSimplePage;