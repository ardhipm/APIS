import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Card, CardMedia, Checkbox } from '@material-ui/core';
import { Icon } from '@iconify/react';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    dialogLayout: {
        maxWidth: '800px'
    },
    imgLayout: {
        maxWidth: '100%'
    },
    outterLayout: {
        minWidth: '100%',
        maxWidth: '100%',
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        padding: '3em',
    },
    btnNav: {
        height: '80px',
        zIndex: theme.zIndex.drawer + 2,
    },
    cardLayout: {
        display: 'contents',
        backgroundColor: 'rgba(0,0,0,0.0)',
        boxShadow: 'none',
        alignItems: 'center',
        zIndex: theme.zIndex.drawer + 2,
    },
    checkLayout: {
        position: 'fixed',
        top: '0',
        left: '0',
        padding: '16px'
    },
    icon: {
        fontSize: '60px',
        color: '#559DCC'
    },
    iconAlbumSelected: {
        fontSize: '60px',
        color: '#FB9300'
    },
    iconPrintSelected: {
        fontSize: '60px',
        color: '#F54748'
    }
}));

const PhotoZoom = (props) => {

    const { 
        totalRestrictionAlbumPhoto,
        totalRestrictionPrintPhoto,
        totalSelectedAlbumPhoto,
        totalSelectedPrintPhoto,
        ...other } = props;

    const classes = useStyles();

    const [check, setCheck] = React.useState(false);
    const [albumCheck, setAlbumCheck] = React.useState(false);
    const [printCheck, setPrintCheck] = React.useState(false);
    // const [isMaxSelectedPhoto, setIsMaxSelectedPhoto] = React.useState(props.maxSelectedPhoto);

    // const [photoName, setPhotoName] = React.useState(driveApiLink(props.photoSrc.basename));


    const driveApiLink = (value) => {
        return 'https://drive.google.com/uc?export=view&id=' + value;
    }


    useEffect(() => {
        // setPhotoName(props.photoSrc.basename);
        console.log('currentPhoto')
        console.log(props.photoSrc)
        setCheck(props.photoSrc.selected)
        setAlbumCheck(props.photoSrc.albumSelected)
        setPrintCheck(props.photoSrc.printSelected)
        document.addEventListener('keydown', handleKeyNext)

        return () => {
            document.removeEventListener('keydown', handleKeyNext)
        }
    }, [props.photoSrc])

    const handleKeyNext = (e) => {
        if (e.keyCode == 39) {
            // console.log('kanan')
            // handleNext(e)
            let btnNext = document.getElementById("zoom-next")
            btnNext.click();
        }
        if (e.keyCode == 37) {
            // console.log('kiri')
            // handlePrev(e)
            let btnNPrev = document.getElementById("zoom-prev")
            btnNPrev.click();
        }
    }

    const handlePrev = (event) => {
        // console.log(event);
        if (!props.disablePrev) {
            props.onPrevPhoto(event, props.photoSrc.idx);
        }
    }

    const handleNext = (event) => {
        if (!props.disableNext) {
            props.onNextPhoto(event, props.photoSrc.idx);
        }

    }

    const handleSelect = (e) => {
        if (e.target.type === 'checkbox') {
            console.log(e.target);
            console.log(props.maxSelectedPhoto);
            if (e.target.id == "checkzoom-album") {
                if (totalSelectedAlbumPhoto >= totalRestrictionAlbumPhoto) {
                    setAlbumCheck(false)
                    props.onSelectedAlbum(props.photoSrc.idx, props.photoSrc.basename, false, e.target.value);
                } else {
                    setAlbumCheck(!albumCheck)
                    props.onSelectedAlbum(props.photoSrc.idx, props.photoSrc.basename, !albumCheck, e.target.value);
                }

            }
            if (e.target.id == "checkzoom-print") {
                if (totalSelectedPrintPhoto >= totalRestrictionPrintPhoto) {
                    setPrintCheck(false)
                    props.onSelectedPrint(props.photoSrc.idx, props.photoSrc.basename, false, e.target.value);
                } else {
                    setPrintCheck(!printCheck)
                    props.onSelectedPrint(props.photoSrc.idx, props.photoSrc.basename, !printCheck, e.target.value);
                }
                
            }
            if (e.target.id == "checkzoom-check"){
                if (!props.maxSelectedPhoto) {
                    setCheck(!check);
                    props.onSelectImage(props.photoSrc.idx, props.photoSrc.basename, !check, e.target.value);
                } else {
                    setCheck(false);
                    props.onSelectImage(props.photoSrc.idx, props.photoSrc.basename, false, e.target.value);
                }
            }

        }
    }


        const handleClose = (event) => {
            if (event.target.id === "photo-zoom-layout") {
                props.onClose();
            }

        };

        const handleCloseButton = () => {
            props.onClose();
        }


        return (
            <div id="photo-zoom-layout"
                className={classes.outterLayout}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={(event) => handleClose(event)}>
                <Card id="photo-zoom-container" className={classes.cardLayout} onClick={handleSelect}  >
                    <Button
                        id="zoom-prev"
                        onClick={handlePrev}
                        style={{ position: 'absolute', left: 0, cursor: 'pointer' }}
                        className={classes.btnNav}
                        disableRipple={props.disablePrev}
                        endIcon={<Icon icon="grommet-icons:previous" style={{ color: 'white', fontSize: '60px' }} />}
                    />

                    <CardMedia
                        style={{ height: 'auto', maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        component="img"
                        height="100%"
                        image={driveApiLink(props.photoSrc.basename)}>


                    </CardMedia>
                    <Button
                        id="zoom-next"
                        onClick={handleNext}
                        style={{ position: 'absolute', right: 0, cursor: 'pointer' }}
                        className={classes.btnNav}
                        disableRipple={props.disableNext}
                        startIcon={<Icon icon="grommet-icons:next" style={{ color: 'white', fontSize: '60px' }} />}
                    ></Button>
                    <Button
                        id="btnClose"
                        onClick={handleCloseButton}
                        style={{ position: 'absolute', right: 0, top: 0, padding: '16px', cursor: 'pointer' }}
                        className={classes.btnNav}
                    // startIcon={<Icon icon="bx:bx-x-circle" style={{ color: 'white', fontSize: '60px' }} />}
                    ><Icon icon="bx:bx-x-circle" style={{ color: 'white', fontSize: '60px' }} /></Button>

                    <Checkbox
                        id="checkzoom-check"
                        style={props.showCheckbox ? {} : { display: 'none' }}
                        icon={<RadioButtonUncheckedIcon className={classes.icon} />}
                        checkedIcon={<CheckCircleIcon className={classes.icon} />}
                        className={classes.checkLayout}
                        checked={check} name="checkedA" />
                    <Checkbox
                        id="checkzoom-album"
                        style={props.showPrintAlbumCheckbox ? {} : { display: 'none' }}
                        icon={<RadioButtonUncheckedIcon className={classes.iconAlbumSelected} />}
                        checkedIcon={<CheckCircleIcon className={classes.iconAlbumSelected} />}
                        className={classes.checkLayout}
                        checked={albumCheck} name="checkedB" />
                    <Checkbox
                        id="checkzoom-print"
                        style={props.showPrintAlbumCheckbox ? { left: '75px' } : { display: 'none' }}
                        icon={<RadioButtonUncheckedIcon className={classes.iconPrintSelected} />}
                        checkedIcon={<CheckCircleIcon className={classes.iconPrintSelected} />}
                        className={classes.checkLayout}
                        checked={printCheck} name="checkedC" />
                </Card>
                {/* <Dialog fullWidth={true}
                maxWidth='lg'
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={props.isZoom}>
                <DialogContent dividers>
                    <img className={classes.imgLayout} src={driveApiLink(props.photoSrc.basename)} />
                </DialogContent>
            </Dialog> */}
            </div>
        );
    }

    export default PhotoZoom;