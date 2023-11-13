'use client'

import styles from './messages.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserData {
    username: string;
    profile_picture: Uint8Array;
    description: string;
    skills: string[] | null;
    interests: string[] | null;
    location: string;
    spoken_languages: string[] | null;
    badges: string[];
    is_setup: boolean;
    is_hirable: boolean;
    is_disabled: boolean;
}

const MessagesComponent = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const router = useRouter();

    useEffect(() => {
        const cookies = document.cookie.split(';');
    
        const sessionCookie = cookies.find((cookie) =>
          cookie.trim().startsWith('session=')
        );
    
        if (sessionCookie) {
          fetch('http://localhost:6969/api/account', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              session: sessionCookie.split('=')[1],
            },
          })
            .then((response) => {
              if (response.status === 401) {
                throw new Error('Invalid session');
              }
              return response.json();
            })
            .then((data: UserData) => {
              setUserData(data);
            })
            .catch((error) => {
              console.error(error);
              router.replace('/login');
            });
        } else {
          router.replace('/login');
        }
      }, [router]);

    return (
        <div className={styles.container}>
            <div className={styles.chats_wrapper}>
                <div>
                <div className={styles.sidebar_chat}>
                    <img className={styles.profile_image} alt="Users profile picture" src={`http://localhost:6969/api/storage/profile/icon/${userData?.username}`} />
                    <div className={styles.text_container}>
                        <h1 className={styles.sidebar_username}>Katsu</h1>
                        <p className={styles.last_chat_sneak_peek}>Could you make a few changes to..</p>
                    </div>
                </div>
                </div>

                <div>

                </div>
            </div>
        </div>
    );
};

export default MessagesComponent;