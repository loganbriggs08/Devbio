'use client'

import { useRouter } from 'next/navigation';
import styles from './navbar.module.css';

export const NavbarComponent: React.FC = () => {
    const router = useRouter()

    const pushToDashboard = () => {
        router.push('/dashboard')
    }

    return (
        <div className={styles.NavBar}>
            <a href="/" className={styles.navbar_top_text}>
                <h1 className={styles.dev_bio_text}>devbio.me</h1>
            </a>

            <ul className={styles.navbar_ul}>
                <li className={styles.navbar_li}><a className={styles.navbar_a} href="/">Home</a></li>
                <li className={styles.navbar_li}><a className={styles.navbar_premium_a} href="/premium">Premium</a></li>
                <li className={styles.navbar_li}><a className={styles.navbar_a} href="/explore">Explore</a></li>

                <button type="button" className={styles.dashboard_button} onClick={pushToDashboard}><p>Dashboard</p></button>
            </ul>
        </div>
    );

};  
