'use client'

import axios from 'axios';
import React, { useState } from 'react';
import styles from "./login.module.css";
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { NavbarComponent } from '@/components/other/navbar';

const LoginComponent = () => {
    const router = useRouter();
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    function setCookie(name: string, value: string, days: number) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + days);
      
        const cookieValue = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString() + "; path=/";
        document.cookie = cookieValue;
    }

    const handleLogin = async () => {
        try {
            const response = await axios.get('http://localhost:6969/api/account/session', {
                headers: {
                    username: usernameInput,
                    password: passwordInput
                }
            });

            if (response.data.session_authentication) {
                setCookie("session", response.data.session_authentication, 30)
                router.push("/dashboard")
            }
            
            if (response.data.error_message == "An account already exists with that username.") {
                ErrorToast(response.data.error_message);
            }
        } catch (error) {
            console.log(error)
            ErrorToast("An Error occured while trying to login.");
        }
    };

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

    return (
        <div>
            <NavbarComponent />
            
            <div className={styles.component_wrapper}>
                <div className={styles.component_wrapper_2}>
                    <div className={styles.header_text_wrapper}>
                        <h1 className={styles.header_text}>Login to Account</h1>
                        <p className={styles.description_text}>Please fill in the information below to login to an Account.</p>

                        <input
                            className={styles.tiktok_username_input}
                            type="text"
                            placeholder="Username"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                        />

                        <input
                            className={styles.password_input}
                            type="password"
                            placeholder="Password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                        />

                        <button className={styles.link_account_button} onClick={() => handleLogin()}>Login to Account</button>

                        <a href="/get-started" className={styles.a_tag}>
                            <p className={styles.no_account}>Don't have an account? Click here</p>
                        </a>
                    </div>
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
        </div>
    );
};

export default LoginComponent;
