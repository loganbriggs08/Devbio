'use client'
import React, { useState, useEffect } from 'react';
import Profile from './Profile';

interface ProfileData {
  username: string;
  profile_picture: string;
  description: string;
  skills: string[];
  interests: string[];
  location: string;
  spoken_languages: string[];
  badges: string[];
  is_setup: boolean;
  is_hirable: boolean;
  is_disabled: boolean;
}

const ProfileGrid: React.FC = () => {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:6969/api/explore');
        const data = await response.json();
        console.log(response)
        setProfiles(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="profile-grid">
      {profiles.map((profile, index) => (
        <Profile key={index} profileData={profile} />
      ))}
    </div>
  );
};

export default ProfileGrid;
