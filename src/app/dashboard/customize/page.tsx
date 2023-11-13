'use client'

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DynamicCustomizeComponent = dynamic(
  () => import('@/components/dashboard/customize/customize') as any,
  {
    ssr: false,
  }
);

const DynamicFinishSetupComponent = dynamic(
  () => import('@/components/other/finish_setup') as any,
  {
    ssr: false,
  }
);

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

const CustomizePage: React.FC = () => {
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
      {userData?.is_setup ? (<DynamicCustomizeComponent />) : userData && (<DynamicFinishSetupComponent />)}
    </div>
  );
};

export default CustomizePage;