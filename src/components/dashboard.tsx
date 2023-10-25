import styles from './dashboard.module.css';
import { useRouter } from 'next/navigation';
import ProfileComponent from '@/components/profile'
import React, { useState, useEffect } from 'react';
import { LoadingComponent } from '@/components/loading';
import { OurPolicies } from './dashboard/our_policies';
import { PrivacySafety } from './dashboard/privacy_safety';
import { Connections } from './dashboard/connections';

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
    const [currentComponent, setCurrentComponent] = useState('profile');


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

    const renderComponent = () => {
        switch (currentComponent) {
          case 'profile':
            return <ProfileComponent userData={userData}/>
          case 'policies':
            return <OurPolicies />;
          case 'privacy':
            return <PrivacySafety/>;   
          case 'connections':
            return <Connections/>;  
          default:
            return <ProfileComponent userData={userData} />;
        }
      };

    const clearCookiesAndRedirect = (() => {
        const cookies = document.cookie.split(';');

        cookies.forEach((cookie) => {
            const cookieParts = cookie.split('=');
            const cookieName = cookieParts[0].trim();
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        router.push("/")
    })

    const pushToPremium = () => {
        router.push('/premium');
    };
  
  return (
    <div className={styles.container}>
        {userData ? (
            <div style={{ display: 'flex', width: '100%'}}>
                <div className={styles.sidebar}>
                    <div className={styles.user_info}>
                        {userData?.profile_picture ? (
                            <img className={styles.profile_image} src="https://cdn.discordapp.com/avatars/1052982721598738522/7e71686c3ef7a0614699aa704e98bd3d.png" />
                        ): (
                            <img className={styles.profile_image} src="https://cdn.discordapp.com/avatars/1052982721598738522/7e71686c3ef7a0614699aa704e98bd3d.png" />
                        )}

                        <div className={styles.info_container}>
                            <h1 className={styles.username_text_user_info}>
                                {userData?.username && userData?.username.length > 7
                                    ? userData?.username.slice(0, 7) + ".."
                                    : userData?.username}
                            </h1>

                            {userData?.is_hirable ? (
                                <p className={styles.location_text}>You are hireable.</p>
                            ) : (
                                <p className={styles.location_text}>Your not hireable.</p>
                            )}
                        </div>
                    </div>

                    <button className={styles.upgrade_button} onClick={pushToPremium}>Upgrade</button>
                    
                    <h1 className={styles.sidebar_section_header}>User Settings</h1>
                    <button className={styles.sidebar_selected_button} onClick={() => setCurrentComponent('profile')}>My Profile</button>
                    <button className={styles.sidebar_button} onClick={() => setCurrentComponent('privacy')}>Privacy & Safety</button>
                    <button className={styles.sidebar_button}>Connections</button>
                    <div className={styles.divider_line}></div>

                    <h1 className={styles.sidebar_section_header}>Site Settings</h1>
                    <button className={styles.sidebar_button}>Appearance</button>
                    <button className={styles.sidebar_button}>Notifications</button>
                    <button className={styles.sidebar_button} onClick={() => setCurrentComponent('policies')}>Our Policies</button>
                    <div className={styles.divider_line}></div>

                    <h1 className={styles.sidebar_section_header}>Payments <span className={styles.coming_soon}>COMING SOON</span></h1>
                    <button className={styles.sidebar_button}>Premium<span className={styles.premiumText}>+</span></button>
                    <button className={styles.sidebar_button}>Subscription</button>
                    <button className={styles.sidebar_button}>Billing</button>
                    <div className={styles.divider_line}></div>
                    
                    <div className={styles.bottom_component_wrapper}>
                        <button onClick={() => {clearCookiesAndRedirect()}} className={styles.logoutButton}>Logout</button>
                    </div>
                </div>

                {/* <div className={styles.content}> */}
                    {/* <ProfileComponent userData={userData}/> */}
                    <div className={styles.content}>{renderComponent()}</div>

                {/* </div> */}
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