import styles from "./premium.module.css"

export default function Premium() {
  return (
    <div className={styles.premium_wrapper}>
      <div className={styles.premium_text_wrapper}>
        <h1 className={styles.premium_header}>Upgrade to <span className={styles.premium_color}>Premium</span></h1>
        <p className={styles.premium_description}>Discover unique <span className={styles.premium_color}>Premium</span> features.</p>
      </div>

      <div className={styles.premium_card_wrapper}>
        <div className={styles.premium_monthly}>
          <h1 className={styles.premium_price_yr}>$9.99<span className={styles.secondary_color_yr}>/month</span></h1>
          <hr className={styles.divider}/>
          <div className={styles.card_content}>
            <p>
              3x Explore Boosts<br/>
              Banner Image<br/>
              Premium Role<br/>
              Premium Badge<br/>
              Coloured Username<br/>
              Access to Beta Features
              <br/>
              <br/>
              <br/>
              <br/>
            </p>
            <button type="button" className={styles.purchase_button}><p>Purchase</p></button>
          </div>
        </div>

        <div className={styles.premium_yearly}>
          <h1 className={styles.premium_price_yr}>$89.99<span className={styles.secondary_color_yr}>/year</span></h1>
          <hr className={styles.divider}/>
          <div className={styles.card_content}>
            <p>
              3x Explore Boosts<br/>
              Banner Image<br/>
              Premium Role<br/>
              Premium Badge<br/>
              Coloured Username<br/>
              Access to Beta Features
              <br/>
              <br/>
              <br/>
              <br/>
            </p>
            <button type="button" className={styles.purchase_button}><p>Purchase</p></button>
          </div>
        </div>
      </div>
    </div>
  )
}
