import React, { useState, useEffect } from 'react';
import { LoadingComponent } from '@/components/loading';
import { ToastContainer, toast } from 'react-toastify';
import styles from '@/components/finish_setup.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

interface UserData {
  username: string;
  profile_picture: Uint8Array;
  description: string;
  skills: string[] | null;
  interests: string[] | null;
  location: string;
  spoken_languages: string[] | null;
  badges: string[];
  is_hirable: boolean;
  is_disabled: boolean;
}

const FinishSetupComponent = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [descriptionText, setDescriptionText] = useState('');
    const [userData, setUserData] = useState<UserData | null>(null);
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [profilePictureBytes, setProfilePictureBytes] = useState<Uint8Array | null>(null);

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
            console.log("Invalid Session")
          }
          return response.json();
        })
        .then((data: UserData) => {
          setUserData(data);
        });
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setProfilePictureFile(selectedFile);
      setStep(3);
    } else {
      ErrorToast("Please select a valid image file.");
    }
  };

  const saveProfilePicture = () => {
    if (profilePictureFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const bytes = new Uint8Array(event.target.result as ArrayBuffer);
          setProfilePictureBytes(bytes);
          handleContinueToDashboard(bytes);
        }
      };
      reader.readAsArrayBuffer(profilePictureFile);
    }
  };

  const handleContinueToDashboard = (bytes: any) => {
    const requestPayload = {
      profile_picture: Array.from(bytes),
      description: descriptionText || "A description for this user has not been set.",
      skills: [],
      location: '',
      interests: [],
      spoken_languages: [],
    };
  
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('session=')
    );
  
    if (sessionCookie) {
      fetch('http://localhost:6969/api/account/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'type': 'setup',
          session: sessionCookie.split('=')[1],
        },
        body: JSON.stringify(requestPayload),
      })
        .then((response) => {
          if (response.status === 401) {
            ErrorToast("Session is invalid, logout and log back in.");
          } else if (response.status === 200) {
            location.reload();
          } else {
            ErrorToast("Failed to update profile for user.");
          }
        });
    }
  };

  const ErrorToast = (message: string) => {
    toast.error(message, {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  return (
    <div className={styles.container}>
      {userData ? (
        <div className={styles.component_wrapper}>
          <div className={styles.component_wrapper_2}>
            <div className={styles.header_text_wrapper}>
              <h1 className={styles.header_text}>Continue to Dashboard</h1>
              <p className={styles.description_text}>To continue to the dashboard, please finish the setup.</p>

              {step === 1 && (
                <div>
                  <input
                    className={styles.account_description}
                    type="text"
                    placeholder="Account Description"
                    value={descriptionText}
                    onChange={(e) => setDescriptionText(e.target.value)}
                  />
                  <button className={styles.finish_setup_button} onClick={() => setStep(2)}>
                    Continue
                  </button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <label htmlFor="imageUpload" className={styles.uploadButton}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      id="imageUpload"
                      className={styles.fileInput}
                    />
                    Upload Profile Picture
                  </label>
                </div>
              )}

              {step === 3 && (
                <button className={styles.finish_setup_button} onClick={saveProfilePicture}>
                  Continue to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <LoadingComponent />
        </div>
      )}

        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{ backgroundColor: '#1E1E20' }}
          />
    </div>
  );
};

export default FinishSetupComponent;