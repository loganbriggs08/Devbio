import styles from './premium.module.css';
import React, { useState, useEffect } from 'react';
import DashboardNavbarComponent from '@/components/dashboard/dashboard_navbar';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { NotificationComponent } from '../../notification/notification';

interface UserData {
    username: string;
    profile_picture: Uint8Array;
    description: string;
    skills: string[];
    interests: string[];
    location: string;
    spoken_languages: string[];
    badges: string[];
    is_hirable: boolean;
    is_disabled: boolean;
}

const PremiumComponent = () => {
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
    
    const ErrorToast = (message: string) => {
		toast.error(message, {  
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});
	}

    const SuccessToast = (message: string) => {
		toast.success(message, {  
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});
	}
  
  return (
    <div>
        <NotificationComponent />
        <DashboardNavbarComponent userData={userData}/>
        
        <div className={styles.settings_container}>
            <div className={styles.top_section_wrapper}>
                <div className={styles.profile_settings_descriptor}>
                    <h1 className={styles.profile_settings_text}>Premium Subscriptions</h1>
                    <p className={styles.profile_description_text}>Pick a Premium Subscription and then press Upgrade.</p>
                </div>
            </div>

            <div className={styles.divider_line}></div>

            <div className={styles.premium_div_wrapper}>
                <div className={styles.premium_div}>
                    <div className={styles.premium_text}>
                    <h1 className={styles.premium_text}>Premium<a className={styles.gold_text}></a>(<a className={styles.price_wrapper}>$4.99</a><a className={styles.price_wrapper}>/month</a>)</h1>
                        <p className={styles.premium_description_text}>Unlock an extensive range of features that allow you to customize your profile precisely the way you desire.</p>
                    </div>

                    <div className={styles.purchase_button_wrapper}>
                        <button className={styles.purchase_button}>Upgrade</button>
                    </div>
                </div>
            </div>

            <div className={styles.premium_div_wrapper}>
                <div className={styles.premium_div}>
                    <div className={styles.premium_text}>
                        <h1 className={styles.premium_text}>Premium<a className={styles.gold_text}>+</a>(<a className={styles.price_wrapper}>$9.99</a><a className={styles.price_wrapper}>/month</a>)</h1>
                        <p className={styles.premium_description_text}>Unlock all features that come with <a className={styles.gold_text}>Premium</a>plus a lot more, view more advanced statistics and dive deeper into customizability.</p>
                    </div>

                    <div className={styles.purchase_button_wrapper}>
                        <button className={styles.purchase_button}>Upgrade</button>
                    </div>
                </div>
            </div>

            <div className={styles.bottom_spacing}></div>

        </div>
        
        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{ backgroundColor: "#1E1E20", fontFamily: "Quicksand" }}
        />
    </div>

  );
};

export default PremiumComponent;