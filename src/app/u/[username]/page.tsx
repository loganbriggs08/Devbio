'use client'

import styles from './page.module.css'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileComponent from '@/components/profile'
import { LoadingComponent } from '@/components/other/loading';

interface UserData {
    username: string;
    profile_picture: Uint8Array;
    description: string;
    skills: string[] | null;
    interests: string[] | null;
    location: string;
    spoken_languages: string[] | null;
    badges: string[];
    is_hirable: boolean;
    is_disabled: boolean;
}

export default function Page({ params }: { params: { username: string } }) {
    const username = params.username;
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:6969/api/account', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'username': username,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else if (response.status === 401) {
                    router.push("/");
                } else {
                    router.push("/");
                }
            } catch (error) {
                router.push("/");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [username]);

    return (
        <div className={styles.container}>
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <ProfileComponent userData={userData} />
            )}
        </div>
    );
};
