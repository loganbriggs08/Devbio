'use client'
import React, { useState, useEffect } from 'react';
import ProfileComponent from '../Profile';
import styles from "./profile_grid.module.css";

interface ProfileData {
  rank: number;
  username: string;
  avg_rating: number;
  years_experience: number;
  commits: number;
  open_projects: number;
  boosts: number;
}

const ProfileGrid: React.FC = () => {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:6969/api/explore');
        const data = await response.json();
        console.log('API Response:', data);
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
          <ProfileComponent userData={profile} />
        </div>
      ))}
    </div>
  );
};

export default ProfileGrid;