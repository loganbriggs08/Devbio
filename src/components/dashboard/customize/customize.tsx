import styles from './customize.module.css';
import React, { useState, useEffect } from 'react';
import { LoadingComponent } from '@/components/loading';
import DashboardNavbarComponent from '@/components/dashboard_navbar';
import { BsCheckLg } from 'react-icons/bs'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { NotificationComponent } from '@/components/notification';

const languages: string[] = [
    "English",
    "German",
    "Danish",
    "Spanish",
    "French",
    "Croatian",
    "Italian",
    "Lithuanian",
    "Hungarian",
    "Dutch",
    "Norwegian",
    "Polish",
    "Portuguese",
    "Romainian",
    "Swedish",
    "Vietnamese",
    "Turkish",
    "Czech",
    "Greek",
    "Bulgarian",
    "Russian",
    "Ukrainian",
    "Hindi",
    "Thai",
    "Chinese",
    "Japanese",
    "Korean"
];

const skills: string[] = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Ruby",
    "Swift",
    "Kotlin",
    "PHP",
    "Go",
    "TypeScript",
    "Rust",
    "Scala",
    "Perl",
    "Haskell",
    "Lua",
    "Objective-C",
    "Dart",
    "Elixir",
    "R",
    "Clojure",
    "Groovy",
    "SQL",
    "Assembly",
    "HTML/CSS",
    "Shell Scripting",
    "VHDL",
    "Verilog",
    "Matlab",
    "Fortran",
    "COBOL",
    "PL/SQL",
    "Ada",
    "Lisp",
    "Prolog",
    "COOL",
    "D",
    "F#",
    "Racket",
    "Erlang",
    "Julia",
    "Scratch",
    "Bash",
    "PowerShell",
    "ABAP",
    "VBScript",
    "Pascal",
    "Photoshop",
    "Figma"
];

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
}

const CustomizeComponent = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [profilePictureUpdated, setProfilePictureUpdated] = useState<boolean>(false);
    const [selectedSettingsMenu, setSelectedSettingsMenu] = useState<number>(1);

    const [selectedColour, setSelectedColor] = useState<number | null>(null);
    const [selectedLanguages, setSelectedLanguages] = useState<any[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
    const [skillsSearchInput, setSkillsSearchInput] = useState("");
    const [interestsInput, setinterestsInput] = useState("");
    const [interests, setInterests] = useState<any[]>([]);
    const [accountDescriptionInput, setAccountDescriptionInput] = useState("")
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [profilePictureBytes, setProfilePictureBytes] = useState<Uint8Array | null>(null);


    useEffect(() => {
        const cookies = document.cookie.split(';');

        const sessionCookie = cookies.find((cookie) =>
            cookie.trim().startsWith('session=')
        );

        if (sessionCookie) { fetch('http://localhost:6969/api/account', { method: 'GET', headers: {'Content-Type': 'application/json', 'session': sessionCookie.split('=')[1]},})
            .then((response) => {
            if (response.status === 401) {
                throw new Error('Invalid session');
            }
            return response.json();
            })

            .then((data: UserData) => {
                setUserData(data);
                setSelectedLanguages(data.spoken_languages)
                setSelectedSkills(data.skills)
                setInterests(data.interests)
                setAccountDescriptionInput(data.description)
            })
        }
    }, []);

    const handleImageUploadAndSave = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files && e.target.files[0];
        if (selectedFile) {
            setProfilePictureFile(selectedFile);
    
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && event.target.result) {
                    const bytes = new Uint8Array(event.target.result as ArrayBuffer);
                    setProfilePictureBytes(bytes);
                    setProfilePictureUpdated(true);
                }
            };
            reader.readAsArrayBuffer(selectedFile);
        } else {
            ErrorToast("Please select a valid image file.");
        }
    };

    const handleSaveChanges = () => {
        if (!userData) {
          return;
        }
      
        const sessionCookie = document.cookie.split(';').find((cookie) =>
          cookie.trim().startsWith('session=')
        );
      
        if (!sessionCookie) {
          return;
        }
      
        const updatedData = {
            profile_picture: profilePictureUpdated && profilePictureBytes ? Array.from(profilePictureBytes) : userData.profile_picture,
            description: accountDescriptionInput,
            skills: selectedSkills,
            location: userData.location,
            interests: interests,
            spoken_languages: selectedLanguages,
        };
      
        fetch('http://localhost:6969/api/account/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            session: sessionCookie.split('=')[1],
            'type': 'setup'
          },
          body: JSON.stringify(updatedData),
        })
          .then((response) => {
            if (response.status === 401) {
              throw new Error('Invalid session');
            }
            return response.json();
          })        
          .then((data) => {
            SuccessToast("Profile has been updated Successfully.")
          })
          .catch((error) => {
            ErrorToast("Profile could not be updated.")
          });
      };
      

    const handleLanguageClick = (language: string) => {
        if (selectedLanguages.includes(language)) {
          setSelectedLanguages(selectedLanguages.filter((item) => item !== language));
        } else if (selectedLanguages.length < 6) {
          setSelectedLanguages([...selectedLanguages, language]);
        }
    };

    const handleSkillClick = (skill: string) => {
        if (selectedSkills.includes(skill)) {
          setSelectedSkills(selectedSkills.filter((item) => item !== skill));
        } else if (selectedLanguages.length < 25) {
          setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleAddInterest = () => {
        if (interestsInput.trim() !== '' && interests.length < 20) {
            if (interestsInput.length <= 100) {
                setInterests([...interests, interestsInput]);
                setinterestsInput('');
            } else {
                setinterestsInput('');
                ErrorToast("Each interest can be no longer than 100 characters.")
            }
        }
    };

    const handleDeleteInterest = (interestToDelete: any) => {
        const updatedInterests = interests.filter((interest) => interest !== interestToDelete);
        setInterests(updatedInterests);
    };
    
    const ErrorToast = (message: string) => {
		toast.error(message, {  
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});
	}

    const SuccessToast = (message: string) => {
		toast.success(message, {  
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});
	}
  
  return (
    <div>
        <NotificationComponent />
        <DashboardNavbarComponent userData={userData}/>

        <div className={styles.category_settings_wrapper}>
            <button onClick={() => setSelectedSettingsMenu(1)} className={styles.settings_selection_button}>Profile Settings</button>
            <div className={styles.center_seperator}></div>
            <button onClick={() => setSelectedSettingsMenu(2)} className={styles.settings_selection_button}>Customization Settings</button>
            <div className={styles.center_seperator}></div>
            <button onClick={() => console.log("Clicked")} className={styles.settings_selection_button}>Connections</button>
        </div>

        <div className={styles.container}>
            {userData ? (
                <div style={{ display: 'flex', width: '100%'}}>
                    {selectedSettingsMenu === 1 ? (
                        <div className={styles.settings_container}>
                            <div className={styles.top_section_wrapper}>
                                <div className={styles.profile_settings_descriptor}>
                                    <h1 className={styles.profile_settings_text}>Profile Settings</h1>
                                    <p className={styles.profile_description_text}>Quickly and easily customize your Profile</p>
                                </div>

                                <div className={styles.save_changes_wrapper}>
                                    <button className={styles.save_button} onClick={handleSaveChanges}>Save Changes</button>
                                </div>
                            </div>

                            <div className={styles.divider_line}></div>

                            <h1 className={styles.header_text}>Choose your Colour</h1>
                            <p className={styles.description_text}>Choose a colour you want to use for your banner</p>

                            <div className={styles.colour_options}>
                                <button onClick={() => setSelectedColor(1)} className={styles.color_one}>
                                    {selectedColour === 1 ? (<div className={styles.tick_icon}><BsCheckLg /></div>): (<div></div>)}
                                </button>

                                <button onClick={() => setSelectedColor(2)} className={styles.color_two}>
                                    {selectedColour === 2 ? (<div className={styles.tick_icon}><BsCheckLg /></div>): (<div></div>)}
                                </button>

                                <button onClick={() => setSelectedColor(3)} className={styles.color_three}>
                                    {selectedColour === 3 ? (<div className={styles.tick_icon}><BsCheckLg /></div>): (<div></div>)}
                                </button>

                                <button onClick={() => setSelectedColor(4)} className={styles.color_four}>
                                    {selectedColour === 4 ? (<div className={styles.tick_icon}><BsCheckLg /></div>): (<div></div>)}
                                </button>

                                <button onClick={() => setSelectedColor(5)} className={styles.color_five}>
                                    {selectedColour === 5 ? (<div className={styles.tick_icon}><BsCheckLg /></div>): (<div></div>)}
                                </button>

                                <button onClick={() => setSelectedColor(6)} className={styles.color_six}>
                                    {selectedColour === 6 ? (<div className={styles.tick_icon}><BsCheckLg /></div>): (<div></div>)}
                                </button>

                                <button onClick={() => setSelectedColor(7)} className={styles.color_seven}>
                                    {selectedColour === 7 ? (<div className={styles.tick_icon}><BsCheckLg /></div>): (<div></div>)}
                                </button>

                                <button onClick={() => setSelectedColor(8)} className={styles.color_eight}>
                                    {selectedColour === 8 ? (<div className={styles.tick_icon}><BsCheckLg /></div>): (<div></div>)}
                                </button>
                            </div>

                            <p className={styles.or_upload_banner_text}>Or upload an image as a Banner..</p>
                            <button className={styles.upload_banner_button}>Upload Banner</button>
                            
                            <div className={styles.divider_line}></div>

                            <h1 className={styles.header_text}>Account Description</h1>
                            <p className={styles.description_text}>What would you like your Account Description to be?</p>

                            <input
                                className={styles.account_description}
                                type="text"
                                placeholder="Account Description"
                                value={accountDescriptionInput}
                                onChange={(e) => setAccountDescriptionInput(e.target.value)}
                            />
                            
                            <div className={styles.divider_line}></div>

                            <h1 className={styles.header_text}>Profile Picture</h1>
                            <p className={styles.description_text}>Choose a special image to use for your Profile Picture</p>

                            <label htmlFor="imageUpload" className={styles.uploadButton}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUploadAndSave}
                                    id="imageUpload"
                                    className={styles.fileInput}
                                />
                                Upload Profile Picture
                            </label>
                        </div>
                    ) : selectedSettingsMenu === 2 ? (
                        <div className={styles.settings_container}>
                            <div className={styles.top_section_wrapper}>
                                <div className={styles.profile_settings_descriptor}>
                                    <h1 className={styles.profile_settings_text}>Customization Settings</h1>
                                    <p className={styles.profile_description_text}>Easily customize your profile even more</p>
                                </div>

                                <div className={styles.save_changes_wrapper}>
                                    <button className={styles.save_button} onClick={handleSaveChanges}>Save Changes</button>
                                </div>
                            </div>

                            <div className={styles.divider_line}></div>

                            <h1 className={styles.header_text}>Customize Languages</h1>
                            <p className={styles.description_text}>Set the languages you are fluent in - <a className={styles.red_text}>Shows on Profile</a></p>

                            <button className={styles.select_country_button} onClick={() => setSelectedSettingsMenu(3)}>Customize Languages</button>

                            <div className={styles.divider_line}></div>

                            <h1 className={styles.header_text}>Customize Skills</h1>
                            <p className={styles.description_text}>Set the skills that you have - <a className={styles.red_text}>Shows on Profile</a></p>

                            <button className={styles.select_country_button} onClick={() => setSelectedSettingsMenu(4)}>Customize Skills</button>

                            <div className={styles.divider_line}></div>

                            <h1 className={styles.header_text}>Customize Interests</h1>
                            <p className={styles.description_text}>Set your interests and or hobbies - <a className={styles.red_text}>Shows on Profile</a></p>

                            <button className={styles.select_country_button} onClick={() => setSelectedSettingsMenu(5)}>Customize Interests</button>
                        </div>
                    ) : selectedSettingsMenu === 3 ? (
                        <div className={styles.settings_container}>
                            <div className={styles.top_section_wrapper}>
                                <div className={styles.profile_settings_descriptor}>
                                    <h1 className={styles.profile_settings_text}>Select Language(s)</h1>
                                    <p className={styles.profile_description_text}>Select the language(s) that you are fluent in.</p>
                                </div>

                                <div className={styles.save_changes_wrapper}>
                                    <button className={styles.save_button} onClick={handleSaveChanges}>Save Changes</button>
                                </div>
                            </div>

                            <div className={styles.divider_line}></div>

                            <div className={styles.languages_wrapper}>
                                {languages &&
                                    languages.map((language, index) => (
                                    <button
                                        key={index}
                                        className={
                                        selectedLanguages.includes(language)
                                            ? styles.language_button_selected
                                            : styles.language_button
                                        }
                                        onClick={() => handleLanguageClick(language)}
                                    >
                                        {language}
                                    </button>
                                    ))}
                            </div>
                        </div>
                    ) : selectedSettingsMenu === 4 ? (
                        <div className={styles.settings_container}>
                            <div className={styles.top_section_wrapper}>
                                <div className={styles.profile_settings_descriptor}>
                                    <h1 className={styles.profile_settings_text}>Select Skills</h1>
                                    <p className={styles.profile_description_text}>Select the skills that you have or are improving.</p>
                                </div>

                                <div className={styles.save_changes_wrapper}>
                                    <button className={styles.save_button} onClick={handleSaveChanges}>Save Changes</button>
                                </div>
                            </div>

                            <div className={styles.divider_line}></div>

                            <input
                                className={styles.account_description}
                                type="text"
                                placeholder="Search for Skills..."
                                value={skillsSearchInput}
                                onChange={(e) => setSkillsSearchInput(e.target.value)}
                            />

                            <div className={styles.skills_wrapper}>
                                {skills
                                    .filter((skill) =>
                                        skill.toLowerCase().includes(skillsSearchInput.toLowerCase())
                                    )
                                    .map((skill, index) => (
                                        <button
                                            key={index}
                                            className={
                                                selectedSkills.includes(skill)
                                                    ? styles.skill_button_selected
                                                    : styles.skill_button
                                            }
                                            onClick={() => handleSkillClick(skill)}
                                        >
                                            {skill}
                                        </button>
                                ))}
                            </div>
                        </div>
                    ) : selectedSettingsMenu === 5 ? (
                        <div className={styles.settings_container}>
                            <div className={styles.top_section_wrapper}>
                                <div className={styles.profile_settings_descriptor}>
                                    <h1 className={styles.profile_settings_text}>Add your Interests</h1>
                                    <p className={styles.profile_description_text}>Add all the things that interest you.</p>
                                </div>

                                <div className={styles.save_changes_wrapper}>
                                    <button className={styles.save_button} onClick={handleSaveChanges}>Save Changes</button>
                                </div>
                            </div>

                            <div className={styles.divider_line}></div>

                            <div className={styles.interest_adder_wrapper}>
                                <input
                                    className={styles.interest_input}
                                    type="text"
                                    placeholder="Add an interest here..."
                                    value={interestsInput}
                                    onChange={(e) => setinterestsInput(e.target.value)}
                                />

                                <button className={styles.add_button} onClick={handleAddInterest}>Add</button>
                            </div>

                            <div className={styles.interests_wrapper}>
                                {interests &&
                                    interests.map((interest, index) => (
                                    <button
                                        key={index}
                                        className={styles.interest_button}
                                        onClick={() => handleDeleteInterest(interest)}
                                    >
                                        {interest}
                                    </button>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <div></div>
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
                        toastStyle={{ backgroundColor: "#1E1E20", fontFamily: "Quicksand" }}
                    />
                </div>
            ) : (
                <div>
                    <LoadingComponent />
                </div>
            )}
        </div>
    </div>

  );
};

export default CustomizeComponent;