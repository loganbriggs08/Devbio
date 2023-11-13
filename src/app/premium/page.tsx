import styles from "./premium.module.css"
import { NavbarComponent } from '@/components/other/navbar'
import { Card } from '@/components/premium/premium_card'


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
          <Card
                  title="Premium"
                  item1="Premium Badge"
                  item2="Explore Boost"
                  item3="Custom Domain"
                  item4="Beta Features"
                  item5="Colored Name"
                  item6="Claim Inactive Usernames"
                  price={5.99}
                  pp={false}
              /> 
          <Card
              title="Premium"
              item1="Premium Features"
              item2="Prioritized Support"
              item3="Premium+ Discord Role"
              item4="5x Explore Boosts"
              item5="More Customisibility"
              item6="Premium+ Badge"
              price={12.99}
              pp={true}
          /> 
        </div>
      </div>
    </div>
  )
}
