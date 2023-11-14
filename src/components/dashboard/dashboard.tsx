'use client'

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
    const [totalProfileViews, setTotalProfileViews] = useState<number>(0);
    const [totalConnectionsClicked, setTotalConnectionsClicked] = useState<number>(0);
    const [clickThroughPercentage, setClickThroughPercentage] = useState<number>(0);
    const [selectedMenu, setSelectedMenu] = useState<string>("statistics")

    useEffect(() => {
        const cookies = document.cookie.split(';');

        const sessionCookie = cookies.find((cookie) =>
            cookie.trim().startsWith('session=')
        );

        if (sessionCookie) {
            fetch('http://localhost:6969/api/account', {
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
                .then((data: UserData) => {
                    setUserData(data);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }

        fetch('http://localhost:6969/api/account/statistics', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                session: sessionCookie?.split('=')[1] || '',
            },
        })
            .then((response) => {
                if (response.status === 401) {
                    throw new Error('Invalid session');
                }
                return response.json();
            })
            .then((data) => {
                let profileViews = 0;
                let connectionsClicked = 0;

                if (data.statistics && data.statistics.length > 0) {
                    const stat = data.statistics[0];

                    if (stat.profile_views) {
                        const views = JSON.parse(stat.profile_views);

                        Object.values(views).forEach((value) => {
                            if (typeof value === 'number') {
                                profileViews += value;
                            }
                        });
                    }

                    if (stat.connections_clicked) {
                        const clicks = JSON.parse(stat.connections_clicked);
                        Object.values(clicks).forEach((value) => {
                            if (typeof value === 'number') {
                                connectionsClicked += value;
                            }
                        });
                    }
                }

                setTotalProfileViews(profileViews);
                setTotalConnectionsClicked(connectionsClicked);
                setClickThroughPercentage(parseFloat(((connectionsClicked / profileViews) * 100).toFixed(2)));

            })
            .catch((error) => {
                console.error('Error fetching statistics:', error);
            });
    }, []);

    return (
        <div>
            <NotificationComponent />
            <DashboardNavbarComponent userData={userData} />

            <div className={styles.container}>
                {userData ? (
                    <div style={{ width: '100%' }}>
                        <h1 className={styles.dashboard_text}>Dashboard</h1>

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

                        {selectedMenu === "statistics" ? (
                            <div className={styles.dashboard_wrapper}>
                                <div className={styles.one_rem_seperator}></div>

                                <div className={styles.statistics_wrapper}>
                                    <div className={styles.statistic_card_1}>
                                        <h1 className={styles.header_text}>Profile Views</h1>
                                        <p className={styles.description_text}>{totalProfileViews.toLocaleString()}</p>
                                    </div>

                                    <div className={styles.statistic_card_2}>
                                        <h1 className={styles.header_text}>Connection Impressions</h1>
                                        <p className={styles.description_text}>{totalConnectionsClicked.toLocaleString()}</p>
                                    </div>

                                    <div className={styles.statistic_card_3}>
                                        <h1 className={styles.header_text}>Connection Click Rate</h1>
                                        <p className={styles.description_text}>{clickThroughPercentage}%</p>
                                    </div>
                                </div>

                                <div className={styles.three_rem_seperator}></div>

                                <div className={styles.profile_views_graph}>
                                    <h1 className={styles.header_text}>Profile Views Graph</h1>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}

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
