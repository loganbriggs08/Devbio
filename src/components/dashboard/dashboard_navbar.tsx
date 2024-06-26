'use client'

import { useRouter } from 'next/navigation';
import styles from './dashboard_navbar.module.css';

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
    color: number;
}

interface DashboardNavbarComponentProps {
    userData: UserData | null;
}

const DashboardNavbarComponent: React.FC<DashboardNavbarComponentProps> = ({ userData }) => {    const navigation = useRouter()
    const router = useRouter();

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
        <div className={styles.NavBar}>
            <a href="/" className={styles.navbar_top_text}>
                <h1 className={styles.dev_bio_text}>devbio.me</h1>
            </a>

            <ul className={styles.navbar_ul}>
                <li className={styles.navbar_li}><a className={styles.navbar_a} href="/dashboard/statistics">Statistics</a></li>
                <li className={styles.navbar_li}><a className={styles.navbar_a} href="/dashboard">User Settings</a></li>
                <li className={styles.navbar_li}><a className={styles.navbar_premium_a} href="/dashboard/premium">Premium</a></li>

                <a href="/dashboard">
                    <button type="button" className={styles.dashboard_button} onClick={() => clearCookiesAndRedirect()}>Sign Out</button>
                </a>
            </ul>
        </div>
    );
}; 

export default DashboardNavbarComponent;
