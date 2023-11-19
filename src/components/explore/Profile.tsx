'use client'
import React from 'react';

// @ts-ignore
const Profile = ({ profileData }) => {
  return (
    <div className="profile">
      <img src={profileData.profile_picture} alt={profileData.username} />
      <h3>{profileData.username}</h3>
      <p>{profileData.description}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default Profile;
