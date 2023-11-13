'use client'

import styles from './loading.module.css';
import BarLoader from 'react-spinners/BarLoader';

export const LoadingComponent: React.FC = () => {

    return (
        <div className={styles.loader}>
            <BarLoader cssOverride={{borderRadius: "0.1rem"}} color="#7091F5" width={500} height={10} speedMultiplier={0.8}/>
        </div>
    );
}; 
