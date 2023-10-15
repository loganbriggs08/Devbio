import styles from "./page.module.css"
import Image from 'next/image'
import { FaLongArrowAltRight } from 'react-icons/fa';

export default function Home() {
    return (
        <main>
              <div className={styles.top}>
                <div className={styles.centered}>
                    <h1 className={styles.top_text}>Create <span className={styles.accentText}>Unique</span> Profiles</h1>
                    <p className={styles.description_text}>Easy to make profiles made to enhance the developer experience!</p>
                    
                    <button className={styles.get_started_button}>Get Started <FaLongArrowAltRight className={styles.arrow_icon} /></button>

                    <div className={styles.image_div}>
                        <a href="/dashboard">
                            <img src="https://cdn.discordapp.com/attachments/1124442686192095345/1163087317871902770/example_profile.png" alt="Example image of a profile made with devbio.me"/>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    )
}   
