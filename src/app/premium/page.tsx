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
                  item1="Get a neat Premium Badge."
                  item2="Receive monthly Explore Boosts."
                  item3="Link a Custom Domain to Profile."
                  item4="Use selection of Colored Usernames."
                  item5="Claim unused/inactive usernames."
                  item6="Access to multiple Beta Features."
                  price={5.99}
                  pp={false}
              /> 
          <Card
              title="Premium"
              item1="All features from the Premium plan."
              item2="Receive Prioritized Support from us."
              item3="Get a Premium+ Discord Role."
              item4="Get an extra 3x Explore Boosts."
              item5="Wider Range of Customisibility."
              item6="Premium+ Badge on devbio Profile."
              price={12.99}
              pp={true}
          /> 
        </div>
      </div>
    </div>
  )
}
