import styles from "./page.module.css"
import { FaLongArrowAltRight } from 'react-icons/fa';

export default function Home() {
    return (
        <main>
              <div className={styles.top}>
                <div className={styles.centered}>
                    <h1 className={styles.top_text}>Create <span className={styles.accentText}>Unique</span> Profiles</h1>
                    <p className={styles.description_text}>Easy to make profiles made to enhance the developer experience!</p>
                    
                    <button className={styles.get_started_button}>Get Started <FaLongArrowAltRight className={styles.arrow_icon} /></button>

                </div>
                </div>
        </main>
    )
}   
