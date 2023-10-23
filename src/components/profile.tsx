import React from 'react';
import styles from '@/components/profile.module.css'

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

interface ProfileComponentProps {
    userData: UserData;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ userData }) => {
    return (
        <div className={styles.profile_wrapper}>
            <div className={styles.profile_top}></div>

            <div className={styles.profile_image_container}>
            {userData?.profile_picture ? (
                <img className={styles.profile_image} src="https://cdn.discordapp.com/avatars/1052982721598738522/7e71686c3ef7a0614699aa704e98bd3d.png" />
            ): (
                <img className={styles.profile_image} src="https://cdn.discordapp.com/avatars/1052982721598738522/7e71686c3ef7a0614699aa704e98bd3d.png" />
            )}
            </div>

            <div className={styles.profile_bottom}>
                <div className={styles.profile_content}>
                    <h1 className={styles.username_text}>{userData?.username}</h1>

                    {userData?.description ? (
                        <p className={styles.description_text}>{userData?.description}</p>
                    ) : (
                        <p className={styles.description_text}>A description for this user has not been set.</p>
                    )}

                </div>
            </div>
        </div>
    );
}

export default ProfileComponent;
