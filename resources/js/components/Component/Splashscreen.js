import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core';

const styledSplashscreen = makeStyles((theme) => ({
    root: {
        justifyContent: 'center',
        display: 'flex',
        height: 100+'vh'
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
        display: 'flex',
        padding: '13em',
        textAlign: 'center',
        justifyContent: 'center'
    
    },
}));


export default function Splashscreen(props){

    const classes = styledSplashscreen();
    return(
        <React.Fragment>
            <CssBaseline />
            <div className={classes.outterLayout} align="center"
                classes={{
                    root: classes.root
                }}
                style={props.open ? {
                    display:"block", backgroundColor:"#000000"
                }:{display:"none"}}
                >
                <img style={{
                    maxHeight:"100%",
                    maxWidth:"100%"
                }} src="/img/AMORPHOTO-PUTIH.gif"/>
            </div>
        </React.Fragment>
    );
}