import React from 'react';
import styles from '@/components/explore/exp_profile_v2.module.css'
import { LoadingComponent } from '@/components/other/loading';
import { useState } from 'react';

interface UserData {
    username: string;
    profile_picture: Uint8Array;
    description: string;
    skills: string[];
    interests: string[];
    location: string;
    spoken_languages: string[];
    badges: string[];
    is_hirable: boolean;
    is_disabled: boolean;
    selected_colour: number;
}

interface ExploreData {
    rank: number;
    username: string;
    avg_rating: number;
    years_experience: number;
    commits: number;
    open_projects: number;
    boosts: number;
  }

interface ProfileComponentProps {
    userData: UserData | null;
    exploreData: ExploreData | null;   
}

const colorIndexToHexMap = [
    "gay",
    "#7091F5",
    "#FC6060",
    "#BC7AF9",
    "#00BD56",
    "#98ACF8",
    "#FF414D",
    "#EE9322",
    "#EA6227",
];

const getLanguageFlags = (spokenLanguages: string[] | null): React.ReactNode[] => {
    const languageFlags: React.ReactNode[] = [];

    const languageEmojiMap: { [key: string]: string } = {
        English: 'gb',
        German: 'de',
        Danish: 'dk',
        Spanish: 'es',
        French: 'fr',
        Croatian: 'hr',
        Italian: 'it',
        Lithuanian: 'tl',
        Hungarian: 'hy',
        Dutch: 'nl',
        Norwegian: 'nc',
        Polish: 'pl',
        Portuguese: 'pt',
        Romainian: 'ro',
        Swedish: 'se',
        Vietnamese: 'vn',
        Turkish: 'tr',
        Czech: 'cz',
        Greek: 'gr',
        Bulgarian: 'bg',
        Russian: 'ru',
        Ukrainian: 'ua',
        Hindi: 'in',
        Thai: 'th',
        Chinese: 'cn',
        Japanese: 'jp',
        Korean: 'kr',
    };

    spokenLanguages?.forEach((l, i) => {
        const cc = languageEmojiMap[l.toLowerCase()];
        const flagUrl = `https://flagcdn.com/24x18/${cc}.png`;

        if (flagUrl) {
            languageFlags.push(<img key={i} src={flagUrl} alt={`${l} flag`}/>)
        }
    })

    return languageFlags;
};

interface BadgeProps {
    type: string;
    userData?: { is_hirable?: boolean };
  }

const Badge: React.FC<BadgeProps> = ({ type, userData }) => {

    let badgeIcon;
    if (type === 'premium') {
      badgeIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none" className={styles.badge}>
            <path opacity="0.8" d="M24.785 9.30966C24.4436 8.17434 23.4192 7.26608 22.2811 7.15254L17.5008 6.47135L15.3383 1.93005C14.7692 0.681195 13.7449 0 12.4929 0C11.2409 0 10.2166 0.681195 9.6475 1.81652L7.48499 6.35782L2.70473 7.15254C1.56657 7.37961 0.542224 8.17434 0.200777 9.30966C-0.254487 10.5585 0.0869606 11.8074 0.997488 12.7156L4.52578 16.2351L3.72907 21.2306C3.50144 22.4794 4.07052 23.7283 5.09486 24.4095C5.66394 24.7501 6.23302 24.9771 6.91592 24.9771C7.48499 24.9771 7.94026 24.8636 8.39552 24.6365L12.7205 22.2524L17.0455 24.6365C18.0699 25.2042 19.3218 25.0907 20.3462 24.4095C21.3705 23.7283 21.9396 22.4794 21.712 21.2306L20.9153 16.2351L24.4436 12.7156C24.8988 11.8074 25.2403 10.445 24.785 9.30966Z" fill="#FFB000"/>
        </svg>
      );
    } else if (type === 'staff') {
      badgeIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none" className={styles.badge}>
            <path d="M21.4019 4.14573H17.95C16.2931 4.14573 14.6362 3.51759 13.5316 2.51256C11.8746 0.879397 9.52732 0 7.18001 0H3.59C1.65692 0 0 1.50754 0 3.26633V4.27136V23.7437C0 24.4975 0.552308 25 1.38077 25C2.20923 25 2.76154 24.4975 2.76154 23.7437V15.5779H7.18001C8.83693 15.5779 10.3558 16.206 11.5985 17.2111C13.2554 18.7186 15.6027 19.598 17.95 19.598H21.4019C23.4731 19.598 24.992 18.0905 24.992 16.3317V7.41206C25.13 5.52764 23.4731 4.14573 21.4019 4.14573Z" fill="#FFB000" fillOpacity="0.8"/>
        </svg>
      );
    }
    
    return badgeIcon;
};


const ProfileComponent: React.FC<ProfileComponentProps> = ({ userData, exploreData }) => {
    const [currentProfilePage, setCurrentProfilePage] = useState<string>("profile");
    const spokenLanguages = userData?.spoken_languages ?? null;
    const languageFlags = getLanguageFlags(spokenLanguages);
    console.log(userData?.username)
    const profileTopStyle = {
        backgroundColor: colorIndexToHexMap[userData?.selected_colour ?? 0],
    };

    const badgeIcons = userData?.badges?.map((badge, index) => (
        <div>
            <Badge key={index} type={badge} userData={userData} />

            {index === 0 && userData?.is_hirable === true ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none" className={styles.badge}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.1358 2.06564C17.1358 1.12873 16.4043 0.387202 15.4042 0.112476C14.4261 -0.156189 13.2415 0.0485501 12.5308 0.812002L8.64756 4.53523L5.48793 7.49021L0.501577 12.2843C0.462705 12.3217 0.426933 12.3609 0.394476 12.4018C-0.123468 13.0539 -0.0857647 13.824 0.244456 14.4061C0.584052 15.0046 1.37102 15.6128 2.55219 15.6128H7.71345V22.902C7.71345 23.8629 8.47332 24.5835 9.46919 24.8656C10.4175 25.1343 11.5266 24.9995 12.3738 24.4662C12.4552 24.415 12.5292 24.3572 12.5947 24.2938L19.5222 17.5816L22.5308 14.7406L22.5511 14.7211L24.5105 12.7855C24.5447 12.7517 24.5765 12.7164 24.6055 12.6798C25.1235 12.0277 25.0858 11.2575 24.7555 10.6755C24.4159 10.0769 23.629 9.46875 22.4478 9.46875H17.1358V2.06564Z" fill="#FFB000" fillOpacity="0.8"/>
                </svg>
            ) : (
                <div></div>
            )}
        </div>
    ));

    return (
        <div className={styles.profile_wrapper}>
            {userData ? (
                <div>
                    <div className={styles.profile_top} style={profileTopStyle}>
                        <button className={styles.send_message_button}>
                            <div className={styles.badges_container}>
                                {badgeIcons}
                            </div>
                        </button>
                    </div>

                    <div className={styles.profile_image_container}>
                        <img className={styles.profile_image} alt="Users profile picture" src={`http://localhost:6969/api/storage/profile/icon/${exploreData?.username}`} />
                        <button className={styles.swap_content_button} onClick={() => {currentProfilePage === "profile" ? setCurrentProfilePage("connections") : setCurrentProfilePage("profile")}}>
                            {currentProfilePage === "profile" ? "Connections" : "Profile"}
                        </button>
                        
                    </div>

                    <div className={styles.profile_bottom}>
                        <div className={styles.profile_content}>
                            <h1 className={styles.username_text}>{exploreData?.username}</h1>
                            
                            {currentProfilePage === "profile" ? (
                                <div>
                                    {userData?.description ? (
                                        <p className={styles.description_text}>{userData?.description}</p>
                                    ) : (
                                        <p className={styles.description_text}>A description for this user has not been set.</p>
                                    )}

                                    <div className={styles.skills_interests_container}>
                                        <div className={styles.skills}>
                                            <h2>Skills:</h2>
                                            {userData?.skills?.map((skill, index) => (
                                                <span key={index} className={styles.skill}>{skill}, </span>
                                            ))}
                                        </div>
                                        <div className={styles.location}>
                                            <h2>Location:</h2>
                                            <p className={styles.location_text}>{userData?.location ? userData.location : "None"}</p>
                                        </div>
                                        <div className={styles.interests}>
                                            <h2>Experience:</h2>
                                                <p className={styles.interest}>{exploreData?.years_experience ? exploreData.years_experience : "None"}</p>
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