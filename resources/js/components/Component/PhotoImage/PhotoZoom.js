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
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    btnNav: {
        height: '80px',
        zIndex: theme.zIndex.drawer + 2,
    },
    cardLayout: {
        display: 'flex',
        maxWidth: '80%',
        maxHeight: '90%',
        backgroundColor: 'rgba(0,0,0,0.0)',
        boxShadow: 'none',
        alignItems: 'center',
        zIndex: theme.zIndex.drawer + 2,
    },
    checkLayout: {
        position: 'absolute',
        top: '48px'
    },
    icon: {
        fontSize: '60px',
        color: '#559DCC'
    }
}));

const PhotoZoom = (props) => {

    const classes = useStyles();

    const [check, setCheck] = React.useState(false);

    // const [photoName, setPhotoName] = React.useState(driveApiLink(props.photoSrc.basename));


    const driveApiLink = (value) => {
        return 'https://drive.google.com/uc?export=view&id=' + value;
    }


    useEffect(() => {
        // setPhotoName(props.photoSrc.basename);
        setCheck(props.photoSrc.selected)
    }, [ props.photoSrc.selected])

    const handlePrev = (event) => {
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
            setCheck(!check);
            props.onSelectImage(props.photoSrc.idx, props.photoSrc.basename, !check, e.target.value);
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
            style={props.isZoom ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : { display: 'none' }}
            onClick={(event) => handleClose(event)}>
            <Card id="photo-zoom-container" className={classes.cardLayout} onClick={handleSelect}>
                <Button
                    onClick={handlePrev}
                    style={{ position: 'absolute', left: 0, cursor: 'pointer' }}
                    className={classes.btnNav}
                    disableRipple={props.disablePrev}
                    endIcon={<Icon icon="grommet-icons:previous" style={{ color: 'white', fontSize: '60px' }} />}
                />

                <CardMedia
                    style={{ height: 'auto', maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    component="img"
                    alt="Contemplative Reptile"
                    height="100%"
                    image={driveApiLink(props.photoSrc.basename)}
                    title="Contemplative Reptile">

                </CardMedia>
                <Button
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
                    icon={<RadioButtonUncheckedIcon className={classes.icon} />}
                    checkedIcon={<CheckCircleIcon className={classes.icon} />}
                    className={classes.checkLayout}
                    checked={check} name="checkedA" />
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