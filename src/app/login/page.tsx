'use client'

import axios from 'axios';
import React, { useState } from 'react';
import styles from "./login.module.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Dashboard = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const handleLogin = async () => {
        console.log("hello world")
        try {
            const response = await axios.post('http://localhost:3001/api/user/login', {
                username: usernameInput,
                password: passwordInput
            });
            console.log('Login Successful', response.data);
        } catch (error) {
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

                    <a href="/register" className={styles.a_tag}>
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
            toastStyle={{ backgroundColor: "#1E1E20" }}
		/>
        </div>
    );
};

export default Dashboard;
