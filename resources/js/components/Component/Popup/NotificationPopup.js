import { makeStyles } from '@material-ui/core';
import { display, lineHeight, maxHeight } from '@material-ui/system';
import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '400px',
        position: 'fixed',
        right: 0,
        top: '3.5em',
        display: 'block',
        flexFlow: 'column',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        zIndex: theme.zIndex.drawer+2

    },
    outterLayout: {
        minWidth: '100%',
        maxWidth: '100%',
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0,0,0,0.0)',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        padding: '3em',
    },
    header: {
        backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',


    },
    notifFont: {
        padding: '15px',
        fontWeight: 'bold',
        fontSize: '16px',
    },
    body: {
        backgroundColor: 'white',
        overflowY: 'scroll',
        maxHeight: '400px'
    },
    item: {
        minHeight: '100px',
        display: 'flex',
        borderBottom: '1px solid #C4C4C4'
    },
    itemRectangle: {
        borderRadius: '8px',
        backgroundColor: '#E0E0E0',
        height: '50px',
        minWidth: '50px',
        textAlign: 'center',
        lineHeight: '4.5',
        alignSelf: 'center',
        marginLeft: '20px',
        marginRight: '20px'
    },
    itemText: {
        alignSelf: 'center'
    }
}))

const NotificationPopup = (props) => {

    // const [open, setOpen] = React.useState(props.open);

    const classes = useStyles();

    const [notifData, setNotifData] = React.useState([]);

    useEffect(() => {
        if (props.open == true) {
            //hit the api
        }
    }, [props.open])

    useEffect(() => {
        // console.log("update popup cukk")
        setNotifData(JSON.parse(localStorage.getItem("notification")))
    }, [localStorage.getItem("notification")])

    

    const handleClose = (event) => {
        if (event.target.id === "notif-layout") {
            props.onClose();
        }

    };

    return (
        <div id="notif-layout"
            className={classes.outterLayout}
            style={props.open ? { display: 'flex', alignItems: 'center', justifyContent: 'center' }: {display: 'none'}}
            onClick={(event) => handleClose(event)}>

            <div className={classes.root} >
                <div className={classes.header}>
                    <div className={classes.notifFont}>Notifikasi</div>
                    {/* <div><Icon icon="bx:bx-edit" style={{ color: 'white' }} /></div> */}
                </div>
                <div className={classes.body}>
                    {notifData.length > 0 ? notifData.map((data, idx) => {
                        return <div key={idx} className={classes.item}>
                            <div className={classes.itemRectangle}><Icon icon="bx:bx-info-circle" style={{ color: '#828282', height: '24px', width: '24px' }} /></div>
                            <div className={classes.itemText}>{data.description}</div>
                        </div>
                    }) : (<div className={classes.item}>
                        <div className={classes.itemRectangle}><Icon icon="bx:bx-info-circle" style={{ color: '#828282', height: '24px', width: '24px' }} /></div>
                        <div className={classes.itemText}>Belum ada notifikasi masuk</div>
                    </div>)}

                </div>
            </div>

        </div>

    )
}

export default NotificationPopup;