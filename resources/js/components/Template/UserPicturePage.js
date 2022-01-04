import React, { useEffect } from 'react';
import { Backdrop, Box, Button, CardMedia, CircularProgress, Container, Grid, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { Delete, GetApp, LocalConvenienceStoreOutlined, Send } from '@material-ui/icons';
import PhotoImage from '../Component/PhotoImage/PhotoImage';
import { Provider } from 'react-redux';
import PhotoZoom from '../Component/PhotoImage/PhotoZoom';
import axios from 'axios';
import WarningDialog from '../Component/Popup/WarningDialog';
import ZipLoadingPopup from '../Component/Popup/ZipLoadingPopup';
import SuccessDialog from '../Component/Popup/SuccessDialog';
import ErrorDialog from '../Component/Popup/ErrorDialog';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LinkToDrivePopup from '../Component/Popup/LinkToDrivePopup';

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
    iconAlbumSelected: {
        color: '#FB9300',
        marginRight: '0.3em'
    },
    iconPrintSelected: {
        color: '#F54748',
        marginRight: '0.3em'
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

const DELETE = "DELETE";
const ALBUM_PRINT = "ALBUM_PRINT";

const UserPicturePage = (props) => {
    const classes = useStyles();

    const [value, setValue] = React.useState(0);
    const [pictures, setPictures] = React.useState([]);
    const [size, setSize] = React.useState(0);
    const [zoom, setZoom] = React.useState(false);
    const [packageName, setPackageName] = React.useState('');
    const [subFolder, setSubFolder] = React.useState([]);
    const [currentSubFolder, setCurrentSubFolder] = React.useState({});
    const [isAnyFolder, setIsAnyFolder] = React.useState(false);

    const [currentPhoto, setCurrentPhoto] = React.useState({ basename: '', idx: 0, selected: false });
    const [disableNext, setDisableNext] = React.useState(true);
    const [disablePrev, setDisablePrev] = React.useState(true);

    const [updateSelect, setUpdateSelect] = React.useState(true);

    const [loading, setLoading] = React.useState(false);
    const [totalSelectedPhoto, setTotalSelectedPhoto] = React.useState(0);
    const [totalRestrictionPhoto, setTotalRestrictionPhoto] = React.useState(0);
    const [isDownloaded, setIsDownloaded] = React.useState(false);
    const [openWarningPopup, setOpenWarningPopup] = React.useState(false);

    const [descriptionMessage, setDescriptionMessage] = React.useState("");
    const [hideDownload, setHideDownload] = React.useState();
    const [btnText, setBtnText] = React.useState("");
    const [warningText, setWarningText] = React.useState("");
    const [zipLoading, setZipLoading] = React.useState(false);

    const [isErrorPopup, setIsErrorPopup] = React.useState(false);
    const [alertPopup, setAlertPopup] = React.useState(false);
    const [lowTotalRestrictionPopup, setLowTotalRestrictionPopup] = React.useState(false);

    const [tabName, setTabName] = React.useState("origin");
    const [warningConfirmBtn, setWarningConfirmBtn] = React.useState(true);

    // number photo
    const [numAlbumPhoto, setNumAlbumPhoto] = React.useState(0);
    const [numPrintPhoto, setNumPrintPhoto] = React.useState(0);
    const [selectedAlbumPhoto, setSelectedAlbumPhoto] = React.useState(0);
    const [selectedPrintPhoto, setSelectedPrintPhoto] = React.useState(0);
    const [typeOfSubmit, setTypeOfSubmit] = React.useState(DELETE);
    const [restrictDelete, setRestrictDelete] = React.useState(false);
    const [restrictAlbumPrint, setRestrictAlbumPrint] = React.useState(false);
    const [showAlbumPrintCheck, setShowAlbumPrintCheck] = React.useState(false);

    const [showDownloadLink, setShowDownloadLink] = React.useState(false);

    const [downloadLink, setDownloadLink] = React.useState("");
    

    useEffect(() => {
        getUserDownloadLink();
    }, []);

    useEffect(() => {
        // //console.log(props.apiLink);

        setLoading(true);


        if (updateSelect) {

            getData(props.apiLink)
            
            getUserCustomerData();
            setUpdateSelect(false);

            // updateTotalSelect(props.apiLink);

        } else {
            setLoading(false);
        }

        setSelectedAlbumPhoto(getTotalAlbumSelectedPhoto(pictures));
        setSelectedPrintPhoto(getTotalPrintSelectedPhoto(pictures));
        if(pictures[value] != undefined){
            setTotalRestrictionPhoto(pictures[value].restrictPhotoLength);

            setTotalSelectedPhoto(pictures[value].choicePhotoLength + pictures[value].pictures.filter(x => x.selected).length);
            if(pictures[value].pictures.length > 0){
                setHideDownload(false);
            }else{
                setHideDownload(true);
            }

            setIsDownloaded(pictures[value].isDownloaded > 0?true:false)

            // console.log(((props.tabValue == 1 ? false : !(pictures[value].isDownload > 0?true:false)) || (props.tabValue == 1 && restrictDelete) || !(pictures[value].pictures.length > 0)))
            // console.log(pictures[value].isDownloaded > 0?true:false)
            // console.log((props.tabValue == 1 ? false : !(pictures[value].isDownload > 0?true:false)))
            // console.log((props.tabValue == 1 && restrictDelete))
            // console.log(!(pictures[value].pictures.length > 0))
        }
        
        // console.log('update picture');


    }, [pictures,  value]);

    // useEffect(() => {
    //     console.log('hide download');
    // }, [hideDownload]);

    useEffect(() => {
        // console.log('hide download');
    }, [selectedAlbumPhoto, selectedPrintPhoto, totalSelectedPhoto, totalRestrictionPhoto, isDownloaded, hideDownload])

    const getUserDownloadLink = () => {
        const token = localStorage.getItem('authToken');
        axios.request({
            method: 'get',
            url: "/api/drive/get_link_download_photo",
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        }).then( res => {
            let values = res.data;
            if(values.success == true){
                setDownloadLink(values.data);
            }

        }).catch( error => {
            console.log(error);
        })
    }

    const getUserCustomerData = () => {
        const token = localStorage.getItem('authToken');

        axios.request({
            method: 'get',
            url: "/api/customer/view",
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        })
            .then(res => {
                // //console.log(res.data.data);

                let values = res.data.data[0];
                if (res.data.success == true) {
                    setPackageName(values.package_name);
                    setNumAlbumPhoto(values.num_album_photo)
                    setNumPrintPhoto(values.num_print_photo)
                    setRestrictDelete(values.restrict_delete > 0 ? true : false)
                    setRestrictAlbumPrint(values.restrict_album_print > 0 ? true : false)

                }

            })
            .catch(error => {
                //console.log(error);
            })
    }

    const getData = (apiLink) => {

        if (props.tabValue == 0) {
            setDescriptionMessage("Download terlebih dahulu foto pada paket untuk melanjutkan proses pemilihan")
            setBtnText("Kirim");
            setWarningText("Foto akan dipindahkan ke foto pilihan, lanjutkan ?")
        } else if (props.tabValue == 1) {
            setDescriptionMessage("Anda dapat menghapus dan mengganti item yang telah terpilih")
            setBtnText("Hapus");
            setWarningText("Foto akan dikembalikan ke foto mentah, lanjutkan ?")
        } else {

        }

        const token = localStorage.getItem('authToken');

        axios.request({
            method: 'get',
            url: apiLink,
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        })
            .then(res => {
                let values = res.data.data;
                //console.log('userpicturepage');
                //console.log(res.data);
                // console.log(values);
                
                let subFolders = [];
                if (res.data.success == true) {
                    values.map(item => {
                        subFolders.push(item);
                    })
                }

                // console.log(subFolders);


                let arraysData = [];
                for (let i = 0; i < subFolders.length; i++) {
                    let arrayPictures = [];

                    for (let j = 0; j < subFolders[i].file.length; j++) {
                        let pic = subFolders[i].file[j];
                        let arrayElement = {
                            idx: j,
                            dir: i,
                            name: pic.name,
                            img: pic.basename,
                            selected: false,
                            albumSelected: pic.is_album,
                            printSelected: pic.is_print
                        }
                        arrayPictures.push(arrayElement);
                    }

                    let folder = {
                        idSubPackage: subFolders[i].id_subpackage,
                        folderName: subFolders[i].folder,
                        folderBaseName: subFolders[i].folder_basename,
                        choicePhotoLength: subFolders[i].num_selected_edit_photo,
                        restrictPhotoLength: subFolders[i].num_edit_photo,
                        isDownloaded: subFolders[i].is_downloaded,
                        pictures: arrayPictures
                    }
                    arraysData.push(folder);

                }

                setPictures(arraysData);
                if (values.length > 0) {
                    setIsAnyFolder(true);
                } else {
                    setIsAnyFolder(false);
                }

                setSubFolder(subFolders);
                setCurrentSubFolder(subFolders[0]);



                setTotalSelectedPhoto(getTotalSelectedPhoto());
                setTotalRestrictionPhoto(values[0].num_edit_photo);

                //console.log(pictures);

                setIsDownloaded(values[0].is_downloaded > 0 ? true : false);

                if (props.tabValue == 1) {
                    // setDescriptionMessage("Anda dapat menghapus dan mengganti item yang telah terpilih")
                    // setHideDownload(true);
                    // setBtnText("Hapus");
                    setIsDownloaded(true);
                }

                // updateTotalSelect(apiLink);

                setLoading(false);
                setUpdateSelect(false);
                setValue(0)
                if(values[0].file.length < 1){
                    setHideDownload(true);
                }else{
                    setHideDownload(false);
                }
            })
            .catch(error => {
                setLoading(false);
            })


    }


    const onClickImage = (event, idx, check, albumCheck, printCheck) => {
        event.preventDefault();
        // //console.log(pictures);
        // //console.log(" index onlick img " + idx);
        // //console.log('cekdong '+check);
        setCurrentPhoto(prevState => {
            return {
                ...prevState,
                basename: pictures[value].pictures[idx].img,
                idx: idx,
                selected: check,
                albumSelected: albumCheck,
                printSelected: printCheck

            }
        })
        if (idx >= pictures[value].pictures.length - 1) {
            setDisableNext(true);

        } else {
            setDisableNext(false);
        }

        if (idx <= 0) {
            setDisablePrev(true);
        } else {
            setDisablePrev(false);
        }

        if (event.target.type != "checkbox") {
            setZoom(true);
        }



    }

    const selectImage = (idx, name, isSelected, e) => {

        let totalSelectPic = pictures[value].pictures.filter(x => x.selected).length;

        if (isSelected && totalSelectPic >= totalRestrictionPhoto) {

        } else {
            let wayae = [...pictures];
            // console.log(wayae)

            wayae[value].pictures[idx].selected = isSelected;
            setPictures(wayae);
            setTotalSelectedPhoto(pictures[value].choicePhotoLength + pictures[value].pictures.filter(x => x.selected).length);
            setTotalRestrictionPhoto(pictures[value].restrictPhotoLength);
            setUpdateSelect(false);
            setCurrentPhoto(prevState => {
                return {
                    ...prevState,
                    picName: pictures[value].pictures[idx].name,
                    basename: pictures[value].pictures[idx].img,
                    idx: idx,
                    selected: isSelected,

                }
            })

        }
    }

    const onSelectAlbumImage = (idx, name, isSelected, e) => {
        let wayae = [...pictures];

        wayae[value].pictures[idx].albumSelected = isSelected;

        setSelectedAlbumPhoto(getTotalAlbumSelectedPhoto(pictures));


    }

    const onSelectPrintImage = (idx, name, isSelected, e) => {
        let wayae = [...pictures];
        wayae[value].pictures[idx].printSelected = isSelected;
        setPictures(wayae);
        setSelectedPrintPhoto(getTotalPrintSelectedPhoto(pictures));
    }

    let getTotalSelectedPhoto = () => {
        return pictures[value].pictures.filter(x => x.selected).length;
    }

    let isMaxSelectedPhoto = () => {
        return totalSelectedPhoto >= totalRestrictionPhoto;
    }

    let getTotalAlbumSelectedPhoto = (pictureData) => {
        let totalAlbumSelected = 0;
        pictureData.map((picture, index) => {
            // console.log(picture)
            totalAlbumSelected = totalAlbumSelected + picture.pictures.filter(x => x.albumSelected).length;
        })
        return totalAlbumSelected;

        // return pictures[value].pictures.filter(x => x.albumSelected).length;
    }

    let getTotalPrintSelectedPhoto = (pictureData) => {
        let totalPrintSelected = 0;
        pictureData.map((picture, index) => {
            totalPrintSelected = totalPrintSelected + picture.pictures.filter(x => x.printSelected).length;
        })
        return totalPrintSelected;
        // return pictures[value].pictures.filter(x => x.printSelected).length;
    }

    const onKirim = () => {
        if (props.tabValue == 0) {
            if (totalSelectedPhoto < 1) {
                setWarningText("Pilih minimal 1 foto untuk di pilih")
                setWarningConfirmBtn(false)
                setOpenWarningPopup(true)
            }else{
                setWarningText("Foto akan di pindahkan ke foto pilihan, lanjutkan ?")
                setOpenWarningPopup(true)
            }
        }
        if (props.tabValue == 1) {
            if (totalSelectedPhoto < 1) {
                setWarningText("Pilih minimal 1 foto untuk di hapus dari foto pilihan")
                setWarningConfirmBtn(false)
                setOpenWarningPopup(true)
            }else{
                setWarningText("Foto akan di pindahkan kembali ke foto mentah, lanjutkan ?")
                setTypeOfSubmit(DELETE);
                setOpenWarningPopup(true);
            }
        }
    }

    const submitPhoto = () => {

        setOpenWarningPopup(false);
        setLoading(true);
        let requestData = pictures[value];
        const token = localStorage.getItem('authToken');

        if (props.tabValue == 0) {
            axios.request({
                data: requestData,
                method: 'post',
                url: '/api/drive/move_to_choice',
                headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
            })
                .then(res => {


                    if (res.data.success == true) {
                        setIsErrorPopup(false);
                        setTimeout(() => {
                            window.location.reload()
                        }, 1500);

                    } else {
                        setIsErrorPopup(true);
                    }

                    setLoading(false);
                    setAlertPopup(true);

                })
                .catch(error => {
                    setLoading(false);
                    setIsErrorPopup(true);
                    setAlertPopup(true);

                })
        } else if (props.tabValue == 1) {
            if (typeOfSubmit == "ALBUM_PRINT") {


                let requestAlbumData = convertedDataAlbumPrint("ALBUM");
                let requestPrintData = convertedDataAlbumPrint("PRINT");

                axios.request({
                    data: requestAlbumData,
                    method: 'post',
                    url: '/api/drive/insert_album_photo',
                    headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
                }).then(res => {
                    if (res.data.success == true) {
                        return axios.request({
                            data: requestPrintData,
                            method: 'post',
                            url: '/api/drive/insert_print_photo',
                            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
                        }).then(res => {
                            if (res.data.success == true) {
                                setIsErrorPopup(false);
                                setTimeout(() => {
                                    window.location.reload()
                                }, 1500);

                            } else {
                                setIsErrorPopup(true);
                            }

                            setLoading(false);
                            setAlertPopup(true);

                            setLoading(false);
                        })
                    } else {
                        setIsErrorPopup(true);
                    }

                })

            }

            if (typeOfSubmit == "DELETE") {
                axios.request({
                    data: requestData,
                    method: 'post',
                    url: '/api/drive/move_to_origin',
                    headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
                })
                    .then(res => {
                        if (res.data.success == true) {
                            setTimeout(() => {
                                window.location.reload()
                            }, 1500);
                        } else {

                        }

                        setLoading(false);

                    })
                    .catch(error => {
                        setLoading(false);

                    })
            }

        }
    }

    const submitAlbumAndPrintPhoto = () => {
        setTypeOfSubmit(ALBUM_PRINT);
        let requestAlbumData = convertedDataAlbumPrint("ALBUM");
        let requestPrintData = convertedDataAlbumPrint("PRINT");

        if (selectedAlbumPhoto < numAlbumPhoto || selectedPrintPhoto < numPrintPhoto) {
            setWarningText("Anda harus memilih semua foto album dan foto cetak sampai limit batas yang tersedia")
            setWarningConfirmBtn(false)
            setOpenWarningPopup(true)
        } else {
            setWarningText("Foto yang telah terpilih sebagai foto album dan foto cetak tidak dapat dipilih ulang, Apakah anda sudah yakin dengan foto yang telah terpilih ?")
            setOpenWarningPopup(true)
        }
    }

    let convertedDataAlbumPrint = (type) => {
        let data = [];
        pictures.map((picture, idx) => {
            let folder = picture.folderName;
            let file = [];

            picture.pictures.map((img, idx) => {
                if (type == "ALBUM") {
                    if (img.albumSelected) {
                        file.push(img.name);
                    }
                }
                if (type == "PRINT") {
                    if (img.printSelected) {
                        file.push(img.name);
                    }
                }
            })
            data.push({
                "folder": folder,
                "file": file
            })
        })

        let requestData = {
            "data": data
        }

        return requestData;

    }

    const handleClosealertPopup = () => {
        setAlertPopup(false);
    }

    const handleCloseLinkDownloadPopup = (e) => {
        e.preventDefault()
        // console.log(e.target.href)
        // console.log(e.target.getAttribute("data-sub-name"))
        // console.log('heredude')
        // console.log(pictures);
        let videoUrl = e.target.href
        const newWindow = window.open(videoUrl, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
        updateIsDownload(e);
        setShowDownloadLink(false);
    }

    const updateIsDownload = (e) => {
        
        const token = localStorage.getItem('authToken');
        axios.request({
            method: 'get',
            url: "/api/drive/update_download/param?subName="+e.target.getAttribute("data-sub-name"),
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        }).then( res => {
            let values = res.data;
            if(values.success == true){
                
                let wayae = [...pictures];
                // let index = e.target.getAttribute("data-idx")+1;
                wayae[e.target.getAttribute("data-idx")].isDownloaded = 1;
                setPictures(wayae);
                setIsDownloaded(pictures[value].isDownloaded > 0?true:false)
            }
            
            

        }).catch( error => {
            console.log(error);
        })
        
    }

    const handleCloseWarningPopup = () => {
        setOpenWarningPopup(false);
        setWarningConfirmBtn(true);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if(subFolder[newValue].file < 1){
            setHideDownload(true);
        }else{
            setHideDownload(false);
        }
        setCurrentSubFolder(subFolder[newValue])
        setTotalSelectedPhoto(pictures[newValue].choicePhotoLength + pictures[newValue].pictures.filter(x => x.selected).length);
        setTotalRestrictionPhoto(subFolder[newValue].num_edit_photo);
        setIsDownloaded(pictures[newValue].isDownloaded);



    };

    const handleZoomOut = () => {
        setZoom(false);
    }

    const onNextPhoto = (event, idx) => {
        // console.log('upp')
        // console.log(currentPhoto)
        let nextPicture = pictures[value].pictures[currentPhoto.idx + 1];
        // console.log(nextPicture)
        onClickImage(event, currentPhoto.idx + 1, nextPicture.selected, nextPicture.albumSelected ,nextPicture.printSelected );
    }

    const onPrevPhoto = (event, idx) => {
        // console.log('upp')
        // console.log(currentPhoto)
        let prevPicture = pictures[value].pictures[currentPhoto.idx - 1];
        // console.log(prevPicture);
        onClickImage(event, currentPhoto.idx - 1, prevPicture.selected, prevPicture.albumSelected, prevPicture.printSelected);


    }
    

    const onDownload = () => {

        setShowDownloadLink(true)

    }

    // const totalSelected = pictures[value].choicePhotoLength?pictures[value].choicePhotoLength:totalSelectedPhoto;

    const subTabFolders = (isAnyFolder ?
        (<Tabs value={value} onChange={handleChange} classes={{ indicator: classes.indicator }} aria-label="simple tabs example">
            {subFolder.map((item, index) => {
                return (<Tab key={index} label={<span className={classes.tabLabel}>{item.folder}</span>} />)

            })}
        </Tabs>) : null)


    const ulala = (isAnyFolder ?
        <Grid item xs={12}>
            <div key={value} value={value} index={value} /** className={value !== 0 ? classes.hidden : ''} */ >
                <Box p={3}>
                    <Grid container spacing={2}>
                        {
                            pictures[value].pictures.length > 0 ? pictures[value].pictures.map((picture, index) => {
                                return (<PhotoImage
                                    key={picture.idx}
                                    idx={index}
                                    tab={picture.dir}
                                    value={picture.img}
                                    picName={picture.name}
                                    formatGrid={3}
                                    selectedPicture={props.tabValue == 2 ? false : true}
                                    totalSelectedPhoto={totalSelectedPhoto}
                                    totalRestrictionPhoto={totalRestrictionPhoto}

                                    totalSelectedAlbumPhoto={selectedAlbumPhoto}
                                    totalRestrictionAlbumPhoto={numAlbumPhoto}
                                    totalSelectedPrintPhoto={selectedPrintPhoto}
                                    totalRestrictionPrintPhoto={numPrintPhoto}

                                    displayDeleteSelected={true}
                                    displayAlbumSelected={props.tabValue == 1 && restrictDelete}
                                    displayPrintSelected={props.tabValue == 1 && restrictDelete}
                                    selected={picture.selected}

                                    albumSelected={picture.albumSelected}
                                    printSelected={picture.printSelected}

                                    onSelectedImage={selectImage}
                                    onClickImage={onClickImage}
                                    onSelectedAlbum={onSelectAlbumImage}
                                    onSelectedPrint={onSelectPrintImage}

                                    restrictDelete={props.tabValue == 1 && restrictDelete}
                                    restrictAlbumPrint={restrictAlbumPrint} />)
                            }) : <div>tidak terdapat foto</div>
                        }
                    </Grid>
                </Box>

            </div>
        </Grid> : <div>tidak terdapat folder</div>)

    const originTab = props.tabValue == 0 ? "Silahkan pilih foto yang ingin di edit! " + totalSelectedPhoto + "/" + totalRestrictionPhoto : null;

    const showAlertPopup = (isErrorPopup ?
        <ErrorDialog
            open={alertPopup}
            text="Terdapat error ketika pemilihan foto"
            handleClose={handleClosealertPopup} /> :
        <SuccessDialog
            open={alertPopup}
            text="Pemilihan foto berhasil!"
            handleClose={handleClosealertPopup} />)

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={6}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                                    {packageName}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" >
                                    <Grid container>
                                        {(props.tabValue != 1 || !restrictDelete) && <Grid item xs={12}>
                                            <div dangerouslySetInnerHTML={{ __html: descriptionMessage }} />
                                        </Grid>}


                                        {props.tabValue == 1 && restrictDelete &&
                                            <div>
                                                {!restrictAlbumPrint &&
                                                    <Grid container item xs={12}>
                                                        Silahkan pilih foto untuk album dan foto untuk dicetak.
                                                    </Grid>}
                                                {restrictAlbumPrint &&
                                                    <Grid container item xs={12}>
                                                        Foto anda sedang di proses untuk di cetak dan di jadikan album. Terima kasih.
                                                    </Grid>}
                                                <Grid container item xs={12}>
                                                    <CheckCircleIcon className={classes.iconAlbumSelected} />Foto album terpilih {selectedAlbumPhoto}/{numAlbumPhoto}
                                                </Grid>
                                                <Grid container item xs={12}>

                                                    <CheckCircleIcon className={classes.iconPrintSelected} />Foto cetak terpilih {selectedPrintPhoto}/{numPrintPhoto}
                                                </Grid>
                                            </div>

                                        }

                                    </Grid>


                                </Typography>
                                <Typography variant="subtitle1" >
                                    {originTab}
                                </Typography>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid item xs={6} align="right" >
                        <Container>

                            {props.tabValue == 1 &&
                                <Button
                                    style={{ marginRight: '0.2em' }}
                                    variant="contained"
                                    color="primary"
                                    disabled={restrictAlbumPrint || !restrictDelete}
                                    endIcon={<Send />}
                                    onClick={submitAlbumAndPrintPhoto}>
                                    Kirim Foto Album dan Foto Cetak
                            </Button>}
                            <Button variant="contained" color="primary" endIcon={props.tabValue == 1 ? <Delete /> : <Send />}
                                disabled={((props.tabValue == 1 ? false : !isDownloaded) || (props.tabValue == 1 && restrictDelete) || hideDownload)}
                                onClick={onKirim}>
                                {btnText}
                            </Button >
                           <Button 
                                variant="contained" 
                                color="primary"  
                                style={{ marginLeft: '0.2em' }}
                                disabled={hideDownload}
                                endIcon={<GetApp />} onClick={onDownload}>
                                Unduh
                            </Button>
                        </Container>

                    </Grid>

                </Grid>
                <Grid container></Grid>
                <Grid container></Grid>
            </Grid>
            <Grid item xs={12}>
                {subTabFolders}
            </Grid>
            {ulala}

            {zoom && <PhotoZoom
                showCheckbox={props.tabValue == 1 && !restrictDelete || props.tabValue == 0 && !restrictDelete}
                showPrintAlbumCheckbox={props.tabValue == 1 && restrictDelete}
                photoSrc={currentPhoto}
                maxSelectedPhoto={isMaxSelectedPhoto()}

                totalSelectedAlbumPhoto={selectedAlbumPhoto}
                totalRestrictionAlbumPhoto={numAlbumPhoto}
                totalSelectedPrintPhoto={selectedPrintPhoto}
                totalRestrictionPrintPhoto={numPrintPhoto}
                // albumSelected={picture.albumSelected}
                // printSelected={picture.printSelected}

                onClose={handleZoomOut}
                onNextPhoto={onNextPhoto}
                onPrevPhoto={onPrevPhoto}
                disableNext={disableNext}
                disablePrev={disablePrev}
                onSelectImage={selectImage}
                onSelectedAlbum={onSelectAlbumImage}
                onSelectedPrint={onSelectPrintImage} />}
            <Backdrop style={{ zIndex: 1000, color: '#fff', }}
                open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>
            <WarningDialog
                open={openWarningPopup}
                handleClose={handleCloseWarningPopup}
                handleConfirm={submitPhoto}
                showConfirmButton={warningConfirmBtn}
                text={warningText} />

            <ZipLoadingPopup
                open={zipLoading}
                // handleClose={handleCloseWarningPopup} 
                // handleConfirm={submitPhoto}
                text="Mohon menunggu sedang membuat zip file..." />
            {alertPopup ? showAlertPopup : null}

            <LinkToDrivePopup
                open={showDownloadLink}
                data={downloadLink}
                handleClose={handleCloseLinkDownloadPopup}
                />
        </Grid>
    );
}

export default UserPicturePage;