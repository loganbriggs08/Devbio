'use client'
import { useRouter } from 'next/navigation';
import styles from './policies.module.css';

export const PrivacySafety: React.FC = () => {

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Your Privacy & Safety</h1>
            <div className={styles.text}>
                At DevBio.me, we take the privacy and safety of our users seriously. We are committed to<br/>
                protecting the personal information and data provided to us in accordance with our Privacy<br/>
                Policy. We employ industry-standard security measures to safeguard your data from<br/>
                unauthorized access, disclosure, or alteration. However, please be aware that no method of<br/>
                transmission over the internet or method of electronic storage is 100% secure, and we <br/>
                cannot guarantee absolute security. You are responsible for maintaining the confidentiality<br/>
                of your account and password, and you agree to notify us immediately of any unauthorized<br/>
                access to or use of your account. Please review our Privacy Policy to understand how we<br/>
                collect, use, and disclose information.


            </div>
        </div>
    );
}; 
