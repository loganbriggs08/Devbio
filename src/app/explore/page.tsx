import styles from "./explore.module.css"
import { NavbarComponent } from '@/components/navbar'


export default function Premium() {
    return (
        <div>
            <div className={styles.center}>
                <div className={styles.top_text}>
                    <h1>Expand Your <span className={styles.colored_text}>Devs</span> Team</h1>
                    <h4>Discover highly skilled <span className={styles.colored_text}>devs</span></h4>
                </div>
                <div className={styles.filters}>
                    <input type="text" placeholder="Find Devs" />
                </div>
            </div>
        </div>
    )
}