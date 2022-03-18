import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Box, Checkbox, FormControlLabel, Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import LoginForm from '../Form/LoginForm';
import { useSelector } from 'react-redux';


const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },

    pos: {
        marginBottom: 12,
    },
    bgLogin: {
        height: 100 + 'vh',
        width: 100 + '%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#171717',
        backgroundImage: `url("img/background-crop-1.jpg")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    },
    cardLogin: {
        boxShadow: 'none',
        maxWidth: 500 + 'px',
        minWidth: 370 + 'px',
        justifySelf: 'center',
        alignSelf: 'center',
        margin: 'auto',
        borderRadius: 16 + 'px',
        display: 'flex',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0)'

    },
    imgLogo: {
        position: 'absolute',
        top: 0,
        height: 115 + 'px',
        width: 115 + 'px',
        zIndex: 5,
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    box1: {
        flex: 1,
        alignSelf: 'flex-end',
        backgroundColor: 'rgb(23, 23, 23, 0.5)'
    },
    box2: {
        flex: 11,
        padding: 20 + 'px',
        backgroundColor: 'rgb(23, 23, 23, 0.5)'

    },
    formLogin: {

    },
    inputTxt: {
        width: 100 + '%'
    },
    inputBtn: {
        width: 100 + '%',
        '&:hover': {
            backgroundColor: '#171717'
        }
    },
    typoBold: {
        fontWeight: 'bold',
        color: 'white',
        paddingRight: '10px',
        paddingTop: '8px'

    },
    bgLogo: {
        position: 'absolute',
        height: 100 + '%',
        color: '#2e2e2e',
        zIndex: 0,

    },
    label: {
        fontSize: 12 + 'px',
        color: 'rgba(0, 0, 0, 0.54)'
    }
}));

export default function Login() {

    const classes = useStyles();
    const isLogged = useSelector(state => state.isLogged);

    if(!localStorage.getItem('FIRST_TERMS')){
        localStorage.setItem('FIRST_TERMS',true)
    }
    return (
        <div className={classes.bgLogin}>
            {isLogged}

            <Card className={classes.cardLogin} >
                <div style={{position: 'relative'}}>
                    
                    <div style={{height: '50px'}}></div>
                    <img className={classes.imgLogo} src="/img/logo.png" />
                    <div style={{height: '50px', backgroundColor: 'rgb(23, 23, 23, 0.5)', borderRadius: '16px 16px 0 0', textAlign: 'right'}}>
                        <Typography variant="h5" className={classes.typoBold} gutterBottom >
                            MASUK
                        </Typography>
                    </div>
                </div>
                <Box width="100%" textAlign="right" className={classes.box1} >
                    
                </Box>
                <Box display="flex" className={classes.box2}>

                    <LoginForm />
                </Box>
            </Card>
        </div>
    );

}