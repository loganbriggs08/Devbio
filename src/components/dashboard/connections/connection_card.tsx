import styles from './connection_card.module.css';

type CardProps = {
    connectionName: string;
    icon: string;
    ifConnectedBool: boolean;
};

export const ConnectionCard: React.FC<CardProps> = ({ connectionName, icon, ifConnectedBool }) => {
    return (
        <div className={styles.container}>
            <div className={styles.icon}>
                {ifConnectedBool ? <img src={icon} alt="icon" /> : null}
            </div>
            <h1 className={styles.title}>
                {connectionName}
            </h1>
        </div>
    );
};
