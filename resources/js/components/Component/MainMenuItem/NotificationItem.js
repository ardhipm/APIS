import { Badge, makeStyles } from '@material-ui/core';
import React from 'react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { readNotification } from '../../Redux/Notification/notification.action';
import { Redirect, useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    root: {

    },
    container: {

    },
    item: {
        position: 'relative',
        minHeight: '100px',
        display: 'flex',
        borderBottom: '1px solid #C4C4C4',
        '&:hover': {
            backgroundColor: '#C4C4C4'
        }
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
        alignSelf: 'center',
        display: 'flex',
        flexFlow: 'column',

    },

}))

const NotificationItem = ({
    id,
    isRead = true,
    description,
    notificationType,
    customerId,
    message,
    createdBy,
    createdAt }) => {

    const notifProps = useSelector((state) => { state.notifReducer })
    const history = useHistory()
    const dispatch = useDispatch();

    const classes = useStyles();

    const date = createdAt.substring(0, 10);
    const hour = createdAt.substring(11, 16);

    const handleClickCard = () => {
        dispatch(readNotification(id));
        // window.location.href = `/admin/pelanggan/edit/${createdBy}`;
        
        if(notificationType == 'CUSTOMER'){
            if(description == 'FOTO MENTAH'){
                history.push(`/pelanggan/paket/foto-mentah`);    
            }

            if(description == 'FOTO PILIHAN'){
                history.push(`/pelanggan/paket/foto-pilihan`);    
            }
            
        }

        if(notificationType == 'ADMIN'){
            history.push(`/admin/pelanggan/edit/${createdBy}`);
        }
        

    }

    return (

        // <Redirect to={`/admin/pelanggan/edit/${createdBy}`}>
            <div className={classes.item} style={{ cursor: 'pointer' }} onClick={handleClickCard} >
                {!isRead && <Icon icon="akar-icons:circle-fill" style={{
                    height: '14px',
                    width: '14px', color: 'red', position: 'absolute', top: '0', left: '0', margin: '5px'
                }} />}
                <div className={classes.itemRectangle}>
                    <Icon icon="bx:bx-info-circle" style={{ color: '#828282', height: '24px', width: '24px' }} />

                </div>

                <div className={classes.itemText} style={{ flex: 1 }}>
                    <div><strong>{description}</strong></div>
                    <div>{message}</div>
                </div>
                <div className={classes.itemText} style={{ paddingRight: '40px' }}>
                    <div><strong>{date}</strong></div>
                    <div><i>{hour}</i></div>
                </div>


            </div>

        // </Redirect>


    )
}

export default NotificationItem;