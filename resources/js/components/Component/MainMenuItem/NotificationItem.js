import { makeStyles } from '@material-ui/core';
import React from 'react';


const useStyles = makeStyles((theme) => ({
    root:{

    },
    container:{
        
    }
}))

const NotificationItem = () => {

    const classes = useStyles();

    return(
        <div className={classes.root}>
            <div className={classes.container}>

            </div>
        </div>
    )
}

export default NotificationItem;