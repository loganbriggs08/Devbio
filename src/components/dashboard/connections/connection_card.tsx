import styles from './connection_card.module.css';

type CardProps = {
    connectionName: string;
    icon: string;
    ifConnectedBool: boolean;
};

export const ConnectionCard: React.FC<CardProps> = ({ connectionName, icon, ifConnectedBool }) => {
    return (
        <div className={styles.container}>
            {ifConnectedBool ? (
                <h1>Connected</h1>
            ) : (
                <div></div>
            )}
        </div>
    );
};
