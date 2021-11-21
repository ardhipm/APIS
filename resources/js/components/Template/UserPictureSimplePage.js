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
    
    const [hideDownload, setHideDownload] = React.useState(true);
    const [loadingData, setLoadingData] = React.useState(false);
    const [zipLoading, setZipLoading] = React.useState(false);
    const [basename, setBasename] = React.useState("");

    const [currentPhoto, setCurrentPhoto] = React.useState({ basename: '', idx: 0, selected: false });
    const [disableNext, setDisableNext] = React.useState(true);
    const [disablePrev, setDisablePrev] = React.useState(true);

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
                console.log(res.data)
                let arraysData = [];
                for (let i = 0; i < res.data.data.length; i++) {
                    let pic = res.data.data[i];
                    let arrayElement = {
                        idx: i,
                        img: pic.basename,
                        selected: false
                    }
                    arraysData.push(arrayElement);

                }
                if(res.data.data.length > 0){
                    setHideDownload(false);
                }
                //console.log(arraysData);
                setBasename(res.data.folder_basename)
                setPictures(arraysData);

                setLoadingData(false);

            })
            .catch(error => {
                setLoadingData(false);
                console.log(error);
            })
    }

    // const onClickImage = (event) => {
    //     event.preventDefault();
    //     if (event.target.type != "checkbox") {
    //         setZoom(true);
    //     }

    // }

    const onDownload = () => {
        setZipLoading(true);
        // console.log(pictures);
        // console.log(basename);

        const token = localStorage.getItem('authToken');

        axios.request({
            method: 'get',
            url: "/api/drive/download_zip_file/param?IdFolder="+ basename+"&type=video",
            headers: { 'Authorization': 'Bearer ' + token },
        })
            .then(res => {
                // console.log(res);
                if(res.data.success == "true"){
                    // console.log('here');
                    setZipLoading(false);
                    window.location.href = res.data.url
                }
                setZipLoading(false);

            })
            .catch(error => {
                console.log(error);
                setZipLoading(false);
            })
    }


    const handleZoomOut = () => {
        setZoom(false);
    }

    const onClickVideo = (event, idx) => {
        let videoUrl = null
        if(pictures[idx] != null){
            videoUrl = 'https://drive.google.com/file/d/'+pictures[idx].img+'/view?usp=sharing';
        }
        // let videoUrl = 'https://drive.google.com/file/d/'+pictures[idx].img+'/view?usp=sharing';
        const newWindow = window.open(videoUrl, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const onClickImage = (event, idx) => {
        event.preventDefault();
        // //console.log(pictures);
        // //console.log(" index onlick img " + idx);
        // //console.log('cekdong '+check);
        // console.log(pictures)
        // console.log(idx);
        setCurrentPhoto(prevState => {
            return {
                ...prevState,
                basename: pictures[idx].img,
                idx: idx,
                

            }
        })
        if (idx >= pictures.length - 1) {
            setDisableNext(true);

        } else {
            setDisableNext(false);
        }

        if (idx <= 0) {
            setDisablePrev(true);
        } else {
            setDisablePrev(false);
        }

        setZoom(true);

    }

    const onNextPhoto = (event, idx) => {
        // console.log('upp')
        // console.log(currentPhoto)
        onClickImage(event, currentPhoto.idx + 1);
    }

    const onPrevPhoto = (event, idx) => {
        // console.log('upp')
        // console.log(currentPhoto)
        onClickImage(event, currentPhoto.idx - 1);


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
                            <Button 
                                variant="contained" 
                                color="primary" 
                                disabled={hideDownload}
                                endIcon={<GetApp />} onClick={onDownload}>
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
                                        onSelectedImage={null}
                                        onClickImage={ props.pageName.toLowerCase() !== "video" ? onClickImage: onClickVideo} />
                                )}
                        </Grid>
                    </Box>

                </div>
            </Grid>
            {props.pageName.toLowerCase() !== "video" && zoom?
                <PhotoZoom 
                    photoSrc={currentPhoto}
                    onClose={handleZoomOut}
                    onNextPhoto={onNextPhoto}
                    onPrevPhoto={onPrevPhoto}
                    disableNext={disableNext}
                    disablePrev={disablePrev}
                    onSelectImage={null}  /> 
                    : null}
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