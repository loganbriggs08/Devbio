import styles from './dashboard.module.css';
import { useRouter } from 'next/navigation';
import ProfileComponent from '@/components/profile'
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
    const router = useRouter();
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

    const clearCookiesAndRedirect = (() => {
        const cookies = document.cookie.split(';');

        cookies.forEach((cookie) => {
            const cookieParts = cookie.split('=');
            const cookieName = cookieParts[0].trim();
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        router.push("/")
    })
  
  return (
    <div className={styles.container}>
        {userData ? (
            <div style={{ display: 'flex', width: '100%'}}>
                <div className={styles.sidebar}>
                    <h1>User Settings</h1>
                    <button className={styles.sidebar_selected_button}>My Profile</button>
                    <button className={styles.sidebar_button}>Privacy & Safety</button>
                    <button className={styles.sidebar_button}>Connections</button>
                    <span className={styles.divider_line}></span>

                    <h1>Payments</h1>
                    <button className={styles.sidebar_button}>Premium<span className={styles.premiumText}>+</span></button>
                    <button className={styles.sidebar_button}>Subscription</button>
                    <button className={styles.sidebar_button}>Billing</button>
                    <span className={styles.divider_line}></span>

                    <h1>Site Settings</h1>
                    <button className={styles.sidebar_button}>Appearance</button>
                    <button className={styles.sidebar_button}>Notifications</button>
                    <button className={styles.sidebar_button}>Our Policies</button>
                    <span className={styles.divider_line}></span>
                    
                    <h1>Devbio</h1>
                    <button className={styles.sidebar_button}>What's new?</button>
                    <button className={styles.sidebar_button}>Social Media</button>
                    <button className={styles.sidebar_button}>Support Server</button>

                    <span className={styles.divider_line}></span>
                    <button onClick={() => {clearCookiesAndRedirect()}} className={styles.logoutButton}>Logout</button>
                </div>

                <div className={styles.content}>
                    <ProfileComponent userData={userData}/>
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