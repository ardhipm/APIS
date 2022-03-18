import React, { useEffect } from 'react';
import NotificationItem from '../../MainMenuItem/NotificationItem';
import { getNotificationUser } from '../../../Redux/Notification/notification.action';
import { useDispatch, useSelector } from 'react-redux';

const NotificationPage = () => {
    const dispatch = useDispatch();
    const notifProps = useSelector((state) => state.notifReducer);
    useEffect(() => {
        // console.log('asdfljsadlkfj');
        dispatch(getNotificationUser());
    }, []);

    useEffect(() => {

    }, [notifProps.notifications])
    return (
        <div>
            <h1>Pemberitahuan</h1>
            {/* <button onClick={() => {console.log(notifProps)}}>check notif props</button> */}
            <div style={{ overflow: 'auto', maxHeight: '740px' }}>
                {notifProps.notifications.map((element, index) => {
                    // console.log(element);
                    return <NotificationItem
                        id={element.id}
                        key={element.id}
                        isRead={element.is_read}
                        description={element.description}
                        notificationType={element.notification_type}
                        message={element.message}
                        createdAt={element.created_at}
                        customerId={element.id_customer}
                        createdBy={element.created_by}
                    />
                })}
            </div>
        </div>
    )
}

export default NotificationPage;