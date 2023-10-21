import styles from './dashboard.module.css';
import React, { useState, useEffect } from 'react';
import { LoadingComponent } from '@/components/loading';

interface UserData {
    username: string;
    profile_picture: string;
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
    <div className={styles.container}>
        {userData ? (
            <div style={{ display: 'flex', width: '100%'}}>
                <div className={styles.sidebar}>
                    <h1>User Settings</h1>
                    <p className={styles.sidebar_p}>My Profile</p>
                    <p className={styles.sidebar_p}>Privacy & Safety</p>
                    <p className={styles.sidebar_p}>Connections</p>
                    <span className={styles.divider_line}></span>
                    <h1>Payments</h1>
                    <p className={styles.sidebar_p}>Premium<span className={styles.premiumText}>+</span></p>
                    <p className={styles.sidebar_p}>Subscription</p>
                    <p className={styles.sidebar_p}>Billing</p>
                    <span className={styles.divider_line}></span>
                    <h1>Site Settings</h1>
                    <p className={styles.sidebar_p}>Appearance</p>
                    <p className={styles.sidebar_p}>Notifications</p>
                    <p className={styles.sidebar_p}>Our Policies</p>
                    <span className={styles.divider_line}></span>
                    
                    <h1>DevBio</h1>
                    <p className={styles.sidebar_p}>What's new?</p>
                    <p className={styles.sidebar_p}>Social Media</p>
                    <p className={styles.sidebar_p}>Support Server</p>

                    <span className={styles.divider_line}></span>
                    <button className={styles.logoutButton}>Logout</button>
                </div>

                <div className={styles.content}>
                    <div className={styles.text_content}>
                        <h1>Main Component</h1>
                    </div>
                </div>
            </div>
        ) : (
            <div>
                <LoadingComponent />
            </div>
        )}
    </div>

  );
};

export default DashboardComponent;