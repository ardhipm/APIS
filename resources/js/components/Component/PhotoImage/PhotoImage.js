import React, { useEffect } from 'react';
import { Box, Button, Card, CardMedia, Checkbox, Container, FormControlLabel, Grid, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PhotoZoom from './PhotoZoom';


const useStyles = makeStyles({
    root: {
        maxWidth: 345,
        height: 245,
        borderRadius: 16 + 'px',
        // backgroundImage: `url("/img/foto.png")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'right'

    },
    media: {

    },
    checkLayout: {

    },
    icon: {
        color: '#559DCC'
    },
    iconAlbumSelected: {
        color: '#FB9300'
    },
    iconPrintSelected: {
        color: '#F54748'
    }
})

const PhotoImage = (props) => {
    const { picName,
        name,
        idx,
        value,
        selected,
        displayDeleteSelected,
        displayAlbumSelected,
        displayPrintSelected,
        totalSelectedPhoto,
        totalRestrictionPhoto,
        totalRestrictionAlbumPhoto,
        totalRestrictionPrintPhoto,
        totalSelectedAlbumPhoto,
        totalSelectedPrintPhoto,
        albumSelected,
        printSelected,

        ...other } = props;
    const [check, setCheck] = React.useState(selected);
    const [albumCheck, setAlbumCheck] = React.useState(albumSelected);
    const [printCheck, setPrintCheck] = React.useState(printSelected);
    const classes = useStyles();

    useEffect(() => {
        setCheck(selected)
        setAlbumCheck(albumSelected)
        setPrintCheck(printSelected)
    }, [selected,albumSelected, printSelected, totalSelectedAlbumPhoto, totalSelectedPrintPhoto, totalSelectedPhoto])

    // //console.log('format grid '+ props.formatGrid);

    const handleClickOpen = (event) => {
        if (event.target.nodeName === "DIV") {
            props.onClickImage(event, idx, check);
        } else {
            handleSelect(event);
        }

    };

    const driveApiLink = (value) => {
        return 'url(https://drive.google.com/thumbnail?id=' + value + ')';
    }


    const handleSelect = (e) => {

        if (e.target.id == "selectCheckbox") {
            if (totalSelectedPhoto >= totalRestrictionPhoto) {
                // console.log('heretre')
                setCheck(false);
                props.onSelectedImage(idx, picName, false, e.target.value);
            } else {
                props.onSelectedImage(idx, picName, !check, e.target.value);
            }
        } else if (e.target.id == "selectAlbum") {
            if (totalSelectedAlbumPhoto >= totalRestrictionAlbumPhoto) {
                setAlbumCheck(false)
                props.onSelectedAlbum(idx, picName, false, e.target.value);
            } else {
                props.onSelectedAlbum(idx, picName, !albumCheck, e.target.value);
            }

        } else if (e.target.id == "selectPrint") {
            if (totalSelectedPrintPhoto >= totalRestrictionPrintPhoto) {
                setPrintCheck(false)
                props.onSelectedPrint(idx, picName, false, e.target.value);
            } else {
                props.onSelectedPrint(idx, picName, !printCheck, e.target.value);
            }
        }


    }

    return (
        <Grid item xs={props.formatGrid === undefined ? 3 : props.formatGrid}>
            <Card className={classes.root} onClick={handleClickOpen} style={{ backgroundImage: !props.value ? `url("/img/foto.png")` : driveApiLink(props.value) }}>
                {displayAlbumSelected &&
                    <Checkbox
                        id="selectAlbum"
                        icon={<RadioButtonUncheckedIcon className={classes.iconAlbumSelected} />}
                        checkedIcon={<CheckCircleIcon className={classes.iconAlbumSelected} />}
                        checked={albumCheck}
                        name="checkedA"
                    />}
                {displayPrintSelected &&
                    <Checkbox
                        id="selectPrint"
                        icon={<RadioButtonUncheckedIcon
                            className={classes.iconPrintSelected} />}
                        checkedIcon={<CheckCircleIcon className={classes.iconPrintSelected} />}
                        checked={printCheck}
                        name="checkedB"
                    />}
                {displayDeleteSelected && props.selectedPicture &&
                    <Checkbox
                        id="selectCheckbox"
                        icon={<RadioButtonUncheckedIcon
                            className={classes.icon} />}
                        checkedIcon={<CheckCircleIcon className={classes.icon} />}
                        className={classes.checkLayout}
                        checked={check}
                        name="checkedC"
                    />}

            </Card>
        </Grid>
    );
}

export default PhotoImage;