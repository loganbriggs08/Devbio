'use client'

import styles from './statistics.module.css';
import React, { useState, useEffect } from 'react';
import { LoadingComponent } from '@/components/other/loading';
import DashboardNavbarComponent from '@/components/dashboard/dashboard_navbar';
import { NotificationComponent } from '@/components/notification/notification'
import { useRouter } from 'next/navigation';
import ProfileActivityGraph from '@/components/graphs/profile_activity'

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

const StatisticsComponent = () => {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [totalProfileViews, setTotalProfileViews] = useState<number>(0);
    const [totalConnectionsClicked, setTotalConnectionsClicked] = useState<number>(0);
    const [clickThroughPercentage, setClickThroughPercentage] = useState<number>(0);
    const [profileViewsArray, setProfileViewsArray] = useState<number[]>([]);
    const [connectionImpressionsArray, setConnectionImpressionsArray] = useState<number[]>([]);
    const [selectedDays, setSelectedDays] = useState<number>(7);

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
                if (data.statistics && data.statistics.length > 0) {
                    const stat = data.statistics[0];
        
                    const profileViewsObject = JSON.parse(stat.profile_views ?? "{}") as Record<string, number>;
                    const connectionsClickedObject = JSON.parse(stat.connections_clicked ?? "{}") as Record<string, number>;
        
                    const keys = Object.keys(profileViewsObject).slice(-selectedDays);
        
                    const profileViewsArrayCurrent = keys.map((key) => profileViewsObject[key]).filter((value) => typeof value === 'number');
                    const profileViews = profileViewsArrayCurrent.reduce((sum, value) => sum + value, 0);
                    
                    const connectionsClickedArrayCurrent = keys.map((key) => connectionsClickedObject[key]).filter((value) => typeof value === 'number');
                    const connectionsClicked = connectionsClickedArrayCurrent.reduce((sum, value) => sum + value, 0);
        
                    setTotalProfileViews(profileViews);
                    setTotalConnectionsClicked(connectionsClicked);
                    setProfileViewsArray(profileViewsArrayCurrent);
                    setConnectionImpressionsArray(connectionsClickedArrayCurrent);

                    setClickThroughPercentage(parseFloat(((connectionsClicked / profileViews) * 100).toFixed(2)));
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [selectedDays]);

    return (
        <div>
            <NotificationComponent />
            <DashboardNavbarComponent userData={userData} />

            <div className={styles.container}>
                {userData && totalConnectionsClicked && clickThroughPercentage && profileViewsArray ? (
                    <div style={{ width: '100%' }}>
                        <div className={styles.header_holder}>
                            <h1 className={styles.dashboard_text}>Statistical Dashboard</h1>

                            <div className={styles.selectable_days_tabs}>
                                {selectedDays === 7 ? (
                                    <div>
                                        <a className={styles.selected_days_tab_text} onClick={() => {setSelectedDays(7)}}>[7 Days</a>
                                        <div className={styles.divider_line}></div>  
                                    </div>
                                ) : (
                                    <a className={styles.days_tab_text} onClick={() => {setSelectedDays(7)}}>[7 Days</a>
                                )}

                                {selectedDays === 14 ? (
                                    <div>
                                        <a className={styles.selected_days_tab_text} onClick={() => {setSelectedDays(14)}}>14 Days</a>
                                        <div className={styles.divider_line}></div>  
                                    </div>
                                ) : (
                                    <a className={styles.days_tab_text} onClick={() => {setSelectedDays(14)}}>14 Days</a>
                                )}

                                {selectedDays === 30 ? (
                                    <div>
                                        <a className={styles.selected_days_tab_text} onClick={() => {setSelectedDays(30)}}>30 Days]</a>
                                        <div className={styles.divider_line}></div>  
                                    </div>
                                ) : (
                                    <a className={styles.days_tab_text} onClick={() => {setSelectedDays(30)}}>30 Days]</a>
                                )}
                            </div>
                        </div>

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

                            <div className={styles.row}>
                                <div className={styles.profile_views_graph}>
                                    <h1 className={styles.header_text_graph}>Profile Activity Graph</h1>
                                    <p className={styles.description_text_graph}>View and monitor your profile activity.</p>

                                    <div className={styles.block_content_wrapper}>
                                        <div className={styles.row}>
                                            <div className={styles.block_wrapper}>
                                                <div className={styles.blue_block}></div>
                                                <p className={styles.block_text}>Profile Views</p>
                                            </div>

                                            <div className={styles.block_wrapper}>
                                                <div className={styles.green_block}></div>
                                                <p className={styles.block_text}>Connection Impressions</p>
                                            </div>
                                        </div>
                                    </div>

                                    <ProfileActivityGraph views={profileViewsArray} connectionImpressions={connectionImpressionsArray}/>
                                </div>

                                <div className={styles.connections_activity}>
                                    <h1 className={styles.header_text_graph}>Connection Activity</h1>
                                    <p className={styles.description_text_graph}>View and monitor your connection activity.</p>

                                    
                                </div>
                            </div>
                        </div>
                        

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

export default StatisticsComponent;
