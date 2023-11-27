'use client'

import styles from './premium_card.module.css';
import { useRouter } from 'next/navigation';
import { IoIosCheckmark } from "react-icons/io";

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

                <div className={styles.feature_list_wrapper}>
                    {/* <p className={styles.extra_features}>Unlock extra features with {title}{pp ? (<span className={styles.premium_text}>+</span>) : ("")}.</p> */}

                    <p className={styles.feature_text}><a className={styles.checkmark_icon}> <IoIosCheckmark /></a>{item1}</p>
                    <p className={styles.feature_text}><a className={styles.checkmark_icon}> <IoIosCheckmark /></a>{item2}</p>
                    <p className={styles.feature_text}><a className={styles.checkmark_icon}> <IoIosCheckmark /></a>{item3}</p>
                    <p className={styles.feature_text}><a className={styles.checkmark_icon}> <IoIosCheckmark /></a>{item4}</p>
                    <p className={styles.feature_text}><a className={styles.checkmark_icon}> <IoIosCheckmark /></a>{item5}</p>
                    <p className={styles.feature_text}><a className={styles.checkmark_icon}> <IoIosCheckmark /></a>{item6}</p>
                </div>

                <button className={styles.purchaseButton} onClick={() => navigation.push("/dashboard/premium")}>Purchase</button>
            </div>
    );
}; 