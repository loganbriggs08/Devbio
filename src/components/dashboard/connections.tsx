'use client'
import { useRouter } from 'next/navigation';
import styles from './connections.module.css';
import { ConnectionCard
 } from './connections/connection_card';
export const Connections: React.FC = () => {

    return (
        <div className={styles.container}>
            <ConnectionCard
                connectionName="Example Connection"
                icon="path_to_icon.png"
                ifConnectedBool={true}
            />
        </div>
    );
}; 
