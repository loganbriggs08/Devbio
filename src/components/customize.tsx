import styles from './customize.module.css';
import React, { useState, useEffect } from 'react';
import { LoadingComponent } from '@/components/loading';
import DashboardNavbarComponent from '@/components/dashboard_navbar';
import { BsCheckLg } from 'react-icons/bs'

const countries: string[] = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Cote d'Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe"
];

const languages: string[] = [
    "English",
    "Chinese",
    "Hindi",
    "Spanish",
    "Arabic",
    "Bengali",
    "Russian",
    "Portuguese",
    "Japanese",
    "German",
    "French",
    "Korean",
    "Italian",
    "Dutch",
    "Swedish",
    "Greek",
    "Turkish",
    "Polish",
    "Vietnamese",
    "Thai",
    "Hebrew",
    "Finnish",
    "Danish",
    "Norwegian",
    "Swahili",
    "Czech",
    "Hungarian",
    "Romanian",
    "Ukrainian",
    "Slovak",
    "Croatian",
    "Serbian",
    "Bulgarian",
    "Macedonian",
    "Lithuanian",
    "Latvian",
    "Estonian",
    "Icelandic",
    "Faroese",
    "Irish",
    "Welsh",
    "Scottish Gaelic",
    "Basque",
    "Catalan",
    "Galician",
    "Breton",
    "Luxembourgish",
    "Maltese",
    "Slovenian",
    "Albanian",
    "Moldovan",
    "Georgian",
    "Armenian",
    "Azerbaijani",
    "Kazakh",
    "Kyrgyz",
    "Uzbek",
    "Turkmen",
    "Tajik",
    "Tatar",
    "Bashkir",
    "Chuvash",
    "Chechen",
    "Ingush",
    "Abkhaz",
    "Ossetian",
    "Dargin",
    "Kumyk",
    "Nogai",
    "Karachay",
    "Balkar",
    "Kabardian",
    "Adyghe",
    "Lezgian",
    "Rutul",
    "Tsakhur",
    "Avar",
    "Lak",
    "Dargwa",
    "Kubachi",
    "Tabasaran",
    "Agul",
    "Rutul",
    "Udi",
    "Nakh",
    "Aghul",
    "Tsakhur",
    "Rutul",
    "Rutul",
    "Archi",
    "Lak",
    "Bagvalal",
    "Tsez",
    "Hunzib",
    "Khwarshi",
    "Bezhta",
    "Botlikh",
    "Tindi",
    "Karata",
    "Tindi",
    "Andi",
    "Ginukh",
    "Gunzib",
    "Mukhomor",
    "Khinalug",
    "Lak",
    "Lak",
    "Tsez",
    "Bats",
    "Udi",
    "Hinukh",
    "Khwarshi",
    "Bezhta",
    "Khwarshi",
    "Laz",
    "Mingrelian",
    "Svan",
    "Abkhaz",
    "Abaza",
    "Ubykh",
    "Rohingya",
    "Sylheti",
    "Khasi",
    "Garo",
    "Bodo",
    "Karbi",
    "Kuki",
    "Kachin",
    "Chin",
    "Mizo",
    "Manipur",
    "Meitei",
    "Naga",
    "Assamese",
    "Odia",
    "Maithili",
    "Bhojpuri",
    "Santali",
    "Nepali",
    "Konkani",
    "Sindhi",
    "Dhivehi",
    "Sinhala",
    "Burmese",
    "Karen",
    "Chin",
    "Zomi",
    "Hakha Chin",
    "Asho Chin",
    "Pa'O",
    "Lahu",
    "Kachin",
    "Wa",
    "Akha",
    "Palaung",
    "Shan",
    "Lisu",
    "Karen",
    "Tibetan",
    "Dzongkha",
    "Sikkimese",
    "Nepali",
    "Bodo",
    "Assamese",
    "Gujarati",
    "Sindhi",
    "Konkani",
    "Marathi",
    "Kannada",
    "Telugu",
    "Tamil",
    "Malayalam",
    "Sinhala",
    "Divehi",
    "Konkani",
    "Kannada",
    "Tulu",
    "Telugu",
    "Tamil",
    "Malayalam",
    "Assamese",
    "Oriya",
    "Maithili",
    "Urdu",
    "Punjabi",
    "Sindhi",
    "Balochi",
    "Pashto",
    "Khowar",
    "Shina",
    "Sindhi",
    "Saraiki",
    "Balochi",
    "Brahui",
    "Kashmiri",
    "Sindhi",
    "Punjabi",
    "Haryanvi",
    "Bengali",
    "Oriya",
    "Assamese",
    "Santali",
    "Bishnupriya Manipuri",
    "Meitei",
    "Naga",
    "Khasi",
    "Garo",
    "Bodo",
    "Karbi",
    "Kuki",
    "Mizo",
    "Rohingya",
    "Sylheti",
    "Sinhala",
    "Tamil",
    "Pali",
    "Sanskrit",
    "Prakrit",
    "Avestan",
    "Old Persian",
    "Middle Persian",
    "Kurdish",
    "Pashto",
    "Dari",
    "Tajik",
    "Talysh",
    "Balochi",
    "Pamiri",
    "Wakhi",
    "Shughni",
    "Rushani",
    "Yagnobi",
    "Khwarezmian",
    "Chorasmian",
    "Khotanese",
    "Sogdian",
    "Bactrian",
    "Khowar",
    "Shina",
    "Phalura",
    "Kohistani",
    "Savi",
    "Kalasha",
    "Dameli",
    "Yidgha",
    "Burushaski",
    "Wakhi",
    "Sarikoli",
    "Wu",
    "Shanghainese",
    "Cantonese",
    "Hakka",
    "Min Nan",
    "Xiang",
    "Gan",
    "Pinghua",
    "Mandarin",
    "Min Dong",
    "Jin"
];

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

const DashboardComponent = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [selectedColour, setSelectedColor] = useState<number | null>(null);
    const [selectedSettingsMenu, setSelectedSettingsMenu] = useState<number>(1);
    const [selectedLanguages, setSelectedLanguages] = useState<any[]>([]);

    useEffect(() => {
        const cookies = document.cookie.split(';');

        const sessionCookie = cookies.find((cookie) =>
            cookie.trim().startsWith('session=')
        );

        if (sessionCookie) { fetch('http://localhost:6969/api/account', { method: 'GET', headers: {'Content-Type': 'application/json', session: sessionCookie.split('=')[1],},})
            .then((response) => {
            if (response.status === 401) {
                throw new Error('Invalid session');
            }
            return response.json();
            })

            .then((data: UserData) => {
                setUserData(data);
            })
        }
    }, []);

  
  return (
    <div>
        <DashboardNavbarComponent userData={userData}/>

        <div className={styles.category_settings_wrapper}>
            <button onClick={() => setSelectedSettingsMenu(1)} className={styles.settings_selection_button}>Profile Settings</button>
            <div className={styles.center_seperator}></div>
            <button onClick={() => setSelectedSettingsMenu(2)} className={styles.settings_selection_button}>Customization Settings</button>
            {/* <div className={styles.center_seperator}></div>
            <button onClick={() => setSelectedSettingsMenu(3)} className={styles.settings_selection_button}>Notification Settings</button> */}
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
                                    <button className={styles.save_button}>Save Changes</button>
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

                            <h1 className={styles.header_text}>Profile Picture</h1>
                            <p className={styles.description_text}>Choose a special image to use for your Profile Picture</p>

                            <button className={styles.upload_profile_picture}>Upload Picture</button>
                        </div>
                    ): (
                        <div className={styles.settings_container}>
                            <div className={styles.top_section_wrapper}>
                                <div className={styles.profile_settings_descriptor}>
                                    <h1 className={styles.profile_settings_text}>Customization Settings</h1>
                                    <p className={styles.profile_description_text}>Easily customize your profile even more</p>
                                </div>

                                <div className={styles.save_changes_wrapper}>
                                    <button className={styles.save_button}>Save Changes</button>
                                </div>
                            </div>

                            <div className={styles.divider_line}></div>

                            <h1 className={styles.header_text}>Account Description</h1>
                            <p className={styles.description_text}>What would you like your Account Description to be?</p>

                            <input
                                className={styles.account_description}
                                type="text"
                                placeholder="Account Description"
                            />

                            <div className={styles.divider_line}></div>

                            <h1 className={styles.header_text}>More Customization</h1>
                            <p className={styles.description_text}>More customization can be done in the dropdowns below</p>

                            <select
                                className={styles.country_dropdown}
                            >

                            <option>Select a Country</option>
                                {countries && countries.map((country, index) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>


                        </div>
                    )}
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

export default DashboardComponent;