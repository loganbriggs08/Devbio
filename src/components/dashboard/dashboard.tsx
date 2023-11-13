import styles from './dashboard.module.css';
import React, { useState, useEffect } from 'react';
import { LoadingComponent } from '@/components/other/loading';
import DashboardNavbarComponent from './dashboard_navbar';
import { NotificationComponent } from '../notification/notification';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [selectedMenu, setSelectedMenu] = useState<string>("statistics")

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
                    <h1>Dashboard</h1>

                    <div className={styles.selectable_tabs}>
                        {selectedMenu === "statistics" ? (
                            <div>
                                <a className={styles.selected_tab_text} onClick={() => {setSelectedMenu("statistics")}}>Statistics</a>
                                <div className={styles.divider_line}></div>  
                            </div>
                        ) : (
                            <a className={styles.tab_text} onClick={() => {setSelectedMenu("statistics")}}>Statistics</a>
                        )}

                        {selectedMenu === "messages" ? (
                            <div>
                                <a className={styles.selected_tab_text} onClick={() => {setSelectedMenu("messages")}}>Messages</a>
                                <div className={styles.divider_line}></div>  
                            </div>
                        ) : (
                            <a className={styles.tab_text} onClick={() => {setSelectedMenu("messages")}}>Messages</a>
                        )}

                        {selectedMenu === "customize" ? (
                            <div>
                                <a className={styles.selected_tab_text} onClick={() => {router.push("/dashboard/customize")}}>Customize</a>
                                <div className={styles.divider_line}></div>  
                            </div>
                        ) : (
                            <a className={styles.tab_text} onClick={() => {router.push("/dashboard/customize")}}>Customize</a>
                        )}

                        {selectedMenu === "premium" ? (
                            <div>
                                <a className={styles.selected_tab_text} onClick={() => {router.push("/dashboard/premium")}}><a className={styles.gold_text}>Premium</a></a>
                                <div className={styles.divider_line}></div>  
                            </div>
                        ) : (
                            <a className={styles.tab_text} onClick={() => {router.push("/dashboard/premium")}}><a className={styles.gold_text}>Premium</a></a>
                        )}
                    </div>

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