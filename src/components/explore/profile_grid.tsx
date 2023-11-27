'use client'
import React, { useState, useEffect } from 'react';
import ProfileComponent from '@/components/explore/explore_profile';
import styles from "./profile_grid.module.css";
import { useRouter } from 'next/navigation';

interface ProfileData {
  rank: number;
  username: string;
  avg_rating: number;
  years_experience: number;
  commits: number;
  open_projects: number;
  boosts: number;
}

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

const ProfileGrid: React.FC = () => {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData2, setUserData] = useState<UserData | null>(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:6969/api/explore');
        const data = await response.json();
        setProfiles(data.explore_data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.profile_grid}>
      {profiles.map((profile, index) => (
        <div key={index} className={styles.profile_grid_item}>
          
          <ProfileComponent exploreData={profile} userData={userData2}/>
        </div>
      ))}
    </div>
  );
};

export default ProfileGrid;