'use client'

import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import { NavbarComponent } from '@/components/navbar'
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
            <NavbarComponent/>
            <div className={styles.top}>
                <div className={styles.centered}>
                    <div className={styles.get_started_header}>
                        {/* <div className={styles.header_example_image}>
                            <a href="/dashboard">
                                <img src="https://cdn.discordapp.com/attachments/1124442686192095345/1164661366305595452/Profiles3.png" alt="Example image of a profile made with devbio.me" />
                            </a>
                        </div> */}

                        <h1 className={styles.top_text}>
                            Create <span className={styles.accentText}>
                                <span ref={wordRef}>{words[wordIndex]}</span>
                            </span> Profiles
                        </h1>
                        <p className={styles.description_text}>
                            Simplify your Developer Journey with easy to make and Tailored Profiles on devbio.me
                            <br />
                            Elevating the Developer Experience has never been easier.
                        </p>

                        <a href="/dashboard">
                            <button className={styles.get_started_button} onClick={pushToDashboard}>
                                Get Started
                            </button>
                        </a>
                    </div>

                    <div className={styles.customizable_profiles}>
                        <div className={styles.profile_example_image}>
                            <a href="/dashboard">
                                <img src="https://cdn.discordapp.com/attachments/1124442686192095345/1163103137297617017/Profile_Showcase3.png" alt="Example image of a profile made with devbio.me" />
                            </a>
                        </div>

                        <div className={styles.customizable_profiles_text}>
                            <h1>Fully <span className={styles.accentText}>Customizable</span> Profiles</h1>
                            <p className={styles.customizable_profiles_text_p}>Creating a fully customized developer based profile has never been easier<br />Create and Edit your profile within minutes to your liking.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
