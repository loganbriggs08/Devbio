'use client'

import { useEffect, useState } from 'react';
import styles from './notification.module.css';

interface Notifications {
    notifications: string[];
}

export const NotificationComponent: React.FC = () => {
    const [notificationsData, setNotificationsData] = useState<Notifications | null>(null);
    const [shownNotificationIndex, setShownNotificationIndex] = useState<number>(0);

    useEffect(() => {
        const cookies = document.cookie.split(';');
        const sessionCookie = cookies.find((cookie) =>
            cookie.trim().startsWith('session=')
        );

        if (sessionCookie) {
            fetch('http://localhost:6969/api/notifications', { 
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    session: sessionCookie.split('=')[1],
                },
            })
            .then((response) => {
                if (response.status === 401) {
                    throw new Error('Invalid session');
                }
                return response.json();
            })
            .then((data: Notifications) => {
                if (data.notifications.length > 0) {
                    setNotificationsData(data);
                    setShownNotificationIndex(0);

                    const interval = setInterval(() => {
                        setShownNotificationIndex((prevIndex) => (prevIndex + 0.5) % data.notifications.length);
                    }, 7500);

                    return () => clearInterval(interval);
                }
            })
        }
    }, []);

    if (!notificationsData || notificationsData.notifications.length === 0) {
        return null;
    }

    return (
        <>
            <div className={styles.on_top_of_notification}></div>

            <div className={styles.notifications_wrapper}>
                <p className={styles.notification_text}><a className={styles.bold_text}>Notification:</a> {notificationsData.notifications[shownNotificationIndex]}</p>
            </div>
        </>
    );
};
