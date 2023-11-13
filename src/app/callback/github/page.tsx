'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingComponent } from '@/components/other/loading';

const GithubLinkComponent = () => {
  const nextRouter = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code');

  useEffect(() => {
    const fetchData = async () => {
        if (code) {
          setLoading(true);

          const cookies = document.cookie.split(';');

          const sessionCookie = cookies.find((cookie) =>
            cookie.trim().startsWith('session=')
          );

          await fetch('http://localhost:6969/api/account/connections/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                type: 'github',
                code: code,
                session: sessionCookie ? sessionCookie.split('=')[1] : "",
              },
          });

          nextRouter.push("/dashboard/customize")

          setLoading(false);
        }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default GithubLinkComponent;
