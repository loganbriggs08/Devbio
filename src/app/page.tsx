'use client'

import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import { NavbarComponent } from '@/components/other/navbar'
import React, { useState, useEffect, useRef } from 'react';

const words = ["Unique", "Developer", "Innovative", "Creative"];
const wordChangeInterval = 3000;
const animationDuration = 1000;

export default function Home() {
    const navigation = useRouter();
    const [wordIndex, setWordIndex] = useState(getRandomIndex());
    const wordRef = useRef<HTMLSpanElement | null>(null);

    function getRandomIndex() {
        return Math.floor(Math.random() * words.length);
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setWordIndex(getRandomIndex());
        }, wordChangeInterval);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (wordRef.current) {
            wordRef.current.classList.add(styles.wordAnimation);

            setTimeout(() => {
                if (wordRef.current) {
                    wordRef.current.classList.remove(styles.wordAnimation);
                }
            }, animationDuration);
        }
    }, [wordIndex]);

    const pushToDashboard = () => {
        navigation.push('/dashboard');
    };

    return (
        <div>
            <NavbarComponent />
            <div className={styles.top}>
                <div className={styles.centered}>
                    <div className={styles.get_started_header}>
                        <h1 className={styles.top_text}>
                            Create <span className={styles.accentText}>
                                <span ref={wordRef}>{words[wordIndex]}</span>
                            </span> Profiles
                        </h1>

                        <p className={styles.description_text}>
                            Simplify the progress of your Developer Journey with easy to make and <br />Tailored Profiles on devbio.me. 
                        </p>

                        <button className={styles.get_started_button} onClick={() => navigation.push("/dashboard")}>
                            Get Started
                        </button>
                    </div>

                    <div className={styles.profile_example_image_top}>
                        <img src="/dashboard_statistics.png" alt="Example image of a profile made with devbio.me" />
                    </div>
                </div>
            </div>
        </div>
    );
}
