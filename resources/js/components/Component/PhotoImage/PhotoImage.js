import React, { useEffect } from 'react';
import { Box, Button, Card, CardMedia, Checkbox, Container, FormControlLabel, Grid, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PhotoZoom from './PhotoZoom';


const useStyles = makeStyles({
    root: {
        maxWidth: 345,
        height: 245,
        borderRadius: 16+'px',
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
    icon:{
        color: '#559DCC'
    }
})

const PhotoImage = (props) => {
    const { picName, name,idx, value,selected,totalSelectedPhoto,totalRestrictionPhoto,   ...other } = props;
    const[check, setCheck] = React.useState(selected);
    const classes = useStyles();

    useEffect(() => {
        setCheck(selected)
    }, [selected,totalSelectedPhoto])

    // //console.log('format grid '+ props.formatGrid);

    const handleClickOpen = (event) => {
        if(event.target.nodeName === "DIV"){
            props.onClickImage(event, idx, check);
        }else{
            handleSelect(event);
        }
        
    };

    const driveApiLink = (value) => {
        return 'url(https://drive.google.com/thumbnail?id='+value+')';
    }
    

    const handleSelect = (e) => {

        if(totalSelectedPhoto >= totalRestrictionPhoto){
            console.log('heretre')
            setCheck(false);   
            props.onSelectedImage(idx, picName, false, e.target.value);
        }else{
            props.onSelectedImage(idx, picName, !check, e.target.value);
        }

        
        
    }


    return (
        <Grid item xs={props.formatGrid === undefined ? 3 : props.formatGrid}>
            <Card className={classes.root} onClick={handleClickOpen} style={{ backgroundImage : !props.value ? `url("/img/foto.png")`:  driveApiLink(props.value)}}>
                {props.selectedPicture && 
                <Checkbox  icon={<RadioButtonUncheckedIcon className={classes.icon}/>} checkedIcon={ <CheckCircleIcon className={classes.icon}/>} className={classes.checkLayout} checked={check} name="checkedA" />}
            </Card>
        </Grid>
    );
}

export default PhotoImage;