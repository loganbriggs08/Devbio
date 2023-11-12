import styles from './dashboard.module.css';
import React, { useState, useEffect } from 'react';
import { LoadingComponent } from '@/components/loading';
import DashboardNavbarComponent from './dashboard_navbar';
import { NotificationComponent } from './notification';

interface UserData {
    username: string;
    profile_picture: Uint8Array;
    description: string;
    skills: string[] | null;
    interests: string[] | null;
    location: string;
    spoken_languages: string[] | null;
    badges: string[];
    is_hirable: boolean;
    is_disabled: boolean;
}

const DashboardComponent = () => {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const cookies = document.cookie.split(';');

        const sessionCookie = cookies.find((cookie) =>
            cookie.trim().startsWith('session=')
        );

        if (sessionCookie) { fetch('http://localhost:6969/api/account', { method: 'GET', headers: {'Content-Type': 'application/json', session: sessionCookie.split('=')[1],},})
            .then((response) => {
            if (response.status === 401) {
                throw new Error('Invalid session');
            }
            return response.json();
            })

            .then((data: UserData) => {
                setUserData(data);
            })
        }
    }, []);
  
  return (
    <div>
        <NotificationComponent />
        <DashboardNavbarComponent userData={userData}/>

        <div className={styles.container}>
            {userData ? (
                <div style={{width: '100%'}}>
                    {/* <div className={styles.dashboard_wrapper}>
                        <h1 className={styles.dashboard_text}>Dashboard</h1>
                        <p></p>

                        <div className={styles.statistics_wrapper}>
                            <div className={styles.statistic_card_1}>
                                <h1 className={styles.header_text}>Profile Views</h1>
                                <p className={styles.description_text}>13,041</p>
                            </div>

                            <div className={styles.statistic_card_2}>
                                <h1 className={styles.header_text}>Profile Views</h1>
                                <p className={styles.description_text}>13,041</p>
                            </div>

                            <div className={styles.statistic_card_3}>
                                <h1 className={styles.header_text}>Profile Views</h1>
                                <p className={styles.description_text}>13,041</p>
                            </div>
                        </div>
                    </div> */}
                </div>
            ) : (
                <div>
                    <LoadingComponent />
                </div>
            )}
        </div>
    </div>

  );
};

export default DashboardComponent;