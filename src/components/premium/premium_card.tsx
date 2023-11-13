'use client'

import styles from './premium_card.module.css';
import { useRouter } from 'next/navigation';

type CardProps = {
    title: string;
    item1: string;
    item2: string;
    item3: string;
    item4: string;
    item5: string;
    item6: string;
    price: number;
    pp: boolean;
};

export const Card: React.FC<CardProps> = ({ title, item1, item2, item3, item4, item5, item6, price, pp }) => {
    const navigation = useRouter();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                {pp ? (
                    <span>
                        {title}<span className={styles.premium_text}>+</span>
                    </span>
                ) : (
                    title
                )}
            </h1>
            <h4 className={styles.price}>${price}<span className={styles.month}>/month</span></h4>
            <div className={styles.divider_line}></div>
            <p>{item1}</p>
            <p>{item2}</p>
            <p>{item3}</p>
            <p>{item4}</p>
            <p>{item5}</p>
            <p>{item6}</p>
            <button className={styles.purchaseButton} onClick={() => navigation.push("/dashboard/premium")}>Purchase</button>
        </div>
    );
}; 