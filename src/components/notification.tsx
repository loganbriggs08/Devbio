'use client'

import styles from './notification.module.css';

export const NotificationComponent: React.FC = () => {

    return (
        <>
            <div className={styles.on_top_of_notification}></div>

            <div className={styles.notifications_wrapper}>
                <p className={styles.notification_text}><a className={styles.bold_text}>Notification:</a> The API is currently down, please try again later.</p>
            </div>
        </>
    );
}; 
