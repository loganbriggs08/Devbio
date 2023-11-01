import styles from './customize.module.css';
import React, { useState, useEffect } from 'react';
import { LoadingComponent } from '@/components/loading';
import DashboardNavbarComponent from '@/components/dashboard_navbar';
import { BsCheckLg } from 'react-icons/bs'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { NotificationComponent } from './notification';

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
        
        <h1>Hello Premium Page</h1>

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