'use client'
import React, { useState } from 'react';
import axios from 'axios';
import styles from "./login.module.css";

const Dashboard = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        console.log('Login')
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/user/login', {
                username,
                password
            });
            console.log('Login Successful', response.data);
        } catch (error) {
            console.error('Login Failed', error);
        }
    };

    return (
        <div>
            <h1 className={styles.login_header}>Login</h1>
            <p className={styles.login_description}>Login to your account.</p>

            <div className={styles.login_form}>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        className={styles.login_input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={styles.login_input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className={styles.login_button}>Login</button>
                </form>

                <a href="/forgot-password" className={styles.login_forgot}>Forgot password?</a>

                <p className={styles.login_register}>Don't have an account? <a href="/register" className={styles.login_register_link}>Register</a></p>
            </div>
        </div>
    );
};

export default Dashboard;