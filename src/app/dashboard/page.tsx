'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface UserData {
  username: string;
  profile_picture: string;
  description: string;
  skills: string[] | null;
  interests: string[] | null;
  location: string;
  spoken_languages: string[] | null;
  badges: string[];
  is_hirable: boolean;
  is_disabled: boolean;
}

const DashboardPage: React.FC = () => {
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
    <div>
      {userData && (
        <div>
          <h1>Welcome to the Dashboard</h1>
          <p>Welcome, {userData.username}!</p>
          {userData.badges && userData.badges.length > 0 && (
            <p>Badges: {userData.badges.join(', ')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;