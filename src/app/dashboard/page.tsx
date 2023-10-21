'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const DashboardPage: React.FC = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split(';');

    const sessionCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('session=')
    );

    if (sessionCookie) {
      fetch('http://localhost:6969/api/accounts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          session: sessionCookie.split('=')[1],
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.username === sessionCookie.split('=')[1]) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            router.replace('/login');
          }
        })
        .catch((error) => {
            setIsLoggedIn(false);
            router.replace('/login');
        });
    } else {
        setIsLoggedIn(false);
        router.replace('/login');
    }
  }, [router]);

  return (
    <div>
        {isLoggedIn === true ? (
            <div>
                <h1>Welcome to the Dashboard</h1>
                <p>Welcome to the dashboard.</p>
            </div>
        ) : null}
    </div>
  );
};

export default DashboardPage;