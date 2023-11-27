import React from 'react';
import styles from '@/components/explore_profile.module.css'
import { LoadingComponent } from '@/components/other/loading';
import { useState } from 'react';

const ProfileComponent: React.FC<ProfileComponentProps> = ({ userData }) => {
    const [currentProfilePage, setCurrentProfilePage] = useState<string>("profile");
    const spokenLanguages = userData?.spoken_languages ?? null;
    const languageFlags = getLanguageFlags(spokenLanguages);

    const profileTopStyle = {
        backgroundColor: colorIndexToHexMap[userData?.selected_colour ?? 0],
    };

    const badgeIcons = userData?.badges.map((badge, index) => (
        <Badge key={index} type={badge} userData={userData} />
    ));

    return (
        <div className={styles.profile_wrapper}>
            {userData ? (
                <div>
                    <div className={styles.profile_top} style={profileTopStyle}></div>

                    <div className={styles.profile_image_container}>
                        <img className={styles.profile_image} alt="Users profile picture" src={`http://localhost:6969/api/storage/profile/icon/${userData?.username}`} />
                        <button className={styles.swap_content_button} onClick={() => {currentProfilePage === "profile" ? setCurrentProfilePage("connections") : setCurrentProfilePage("profile")}}>
                            {currentProfilePage === "profile" ? "Connections" : "Profile"}
                        </button>
                        <button className={styles.send_message_button}>
                            <div className={styles.badges_container}>
                                {badgeIcons}
                            </div>
                        </button>
                    </div>

                    <div className={styles.profile_bottom}>
                        <div className={styles.profile_content}>
                            <h1 className={styles.username_text}>{userData?.username}</h1>
                            
                            {currentProfilePage === "profile" ? (
                                <div>
                                    {userData?.description ? (
                                        <p className={styles.description_text}>{userData?.description}</p>
                                    ) : (
                                        <p className={styles.description_text}>A description for this user has not been set.</p>
                                    )}

                                    <div className={styles.skills_interests_container}>
                                        <div className={styles.skills}>
                                            <h2>Years of Experience:</h2>
                                            <p>{userData?.years_experience}</p>
                                        </div>
                                        <div className={styles.location}>
                                            <h2>Commits:</h2>
                                            <p>{userData?.commits}</p>
                                        </div>
                                        <div className={styles.interests}>
                                            <h2>Open Projects:</h2>
                                            <p>{userData?.open_projects}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : currentProfilePage === "connections" ? (
                                <div>
                                    <h1>Connect Page</h1>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <LoadingComponent />
                </div>
            )}
        </div>
    );
}

export default ProfileComponent;
