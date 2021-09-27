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
        backgroundImage: `url("img/background-crop.jpg")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    },
    cardLogin: {

        maxWidth: 500 + 'px',
        minWidth: 370 + 'px',
        justifySelf: 'center',
        alignSelf: 'center',
        margin: 'auto',
        borderRadius: 16 + 'px',
        display: 'flex',
        padding: 12 + 'px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1,
        backgroundColor: 'rgb(23, 23, 23, 0.5)'

    },
    imgLogo: {
        position: 'absolute',
        [theme.breakpoints.down('sm')]: {
            top: 10 + '%',
        },
        [theme.breakpoints.up('md')]: {
            top: 10 + '%',
        },
        [theme.breakpoints.up('lg')]: {
            top: 10 + '%',
        },
        [theme.breakpoints.up('xl')]: {
            top: 17 + '%',
        },
        height: 170 + 'px',
        width: 170 + 'px',
        zIndex: 5,
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    box1: {
        flex: 1,
        alignSelf: 'flex-end',
    },
    box2: {
        flex: 11,
        padding: 20 + 'px'

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
        color: 'white'
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
                <img className={classes.imgLogo} src="/img/logo.png" />
                <Box width="100%" textAlign="right" className={classes.box1}>
                    <Typography variant="h5" className={classes.typoBold} gutterBottom >
                        MASUK
                    </Typography>
                </Box>
                <Box display="flex" className={classes.box2}>

                    <LoginForm />
                </Box>
            </Card>
        </div>
    );

}