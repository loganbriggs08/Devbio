import styles from "./premium.module.css"
import { CustomCard } from "../components/Card"
import { NavbarComponent } from '@/components/navbar'


export default function Premium() {
  return (
    <div>
      <NavbarComponent />
      
      <div className={styles.premium_wrapper}>
        <div className={styles.premium_text_wrapper}>
          <h1 className={styles.premium_header}>Upgrade to <span className={styles.premium_color}>Premium</span></h1>
          <p className={styles.premium_description}>Discover unique <span className={styles.premium_color}>Premium</span> features.</p>
        </div>
        <div className={styles.centered}>
          <CustomCard
            title="Premium"
            description="3x Explore Boosts\nBanner Image\nPremium Role\nPremium Badge\nColoured Username\nAccess to Beta Features\n\n\n\n"
            buttonText="Purchase"
          />
          <CustomCard
            title="Premium+"
            description=""
            buttonText="Purchase"
          />
        </div>
      </div>
    </div>
  )
}
