import styles from './dashboard.module.css';
import { useRouter } from 'next/navigation';
import ProfileComponent from '@/components/profile'
import React, { useState, useEffect } from 'react';
import { LoadingComponent } from '@/components/loading';
import { OurPolicies } from './dashboard/our_policies';
import { PrivacySafety } from './dashboard/privacy_safety';
import { Connections } from './dashboard/connections';
import DashboardNavbarComponent from './dashboard_navbar';

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

    const pushToPremium = () => {
        router.push('/premium');
    };
  
  return (
    <div>
        <DashboardNavbarComponent userData={userData}/>

        <div className={styles.container}>
            {userData ? (
                <div style={{ display: 'flex', width: '100%'}}>
                    <h1>Over View</h1>
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