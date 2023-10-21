'use client'

import axios from 'axios';
import React, { useState } from 'react';
import styles from "./get-started.module.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const GetStartedComponent = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:6969/api/accounts', {
                username: usernameInput,
                password: passwordInput
            });
            
            console.log(response.status)

            if (response.status == 401) {
                ErrorToast("Failed to login, username or password entered was incorrect.");
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
        <div className={styles.component_wrapper}>
            <div className={styles.component_wrapper_2}>
                <div className={styles.header_text_wrapper}>
                    <h1 className={styles.header_text}>Get Started</h1>
                    <p className={styles.description_text}>Please fill in the information below to create an Account.</p>

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

                    <button className={styles.link_account_button} onClick={() => handleLogin()}>Create an Account</button>

                    <a href="/login" className={styles.a_tag}>
                        <p className={styles.no_account}>Already have an account? Click here</p>
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
            toastStyle={{ backgroundColor: "#1E1E20" }}
		/>
        </div>
    );
};

export default GetStartedComponent;
