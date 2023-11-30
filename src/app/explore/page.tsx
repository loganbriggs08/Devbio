'use client'
import styles from "./explore.module.css"
import React, { useState, useEffect } from 'react';
import Profile from '@/components/explore/explore_profile';
import ProfileGrid from "@/components/explore/profile_grid";

const ExplorePage = () => {
  const [profiles, setProfiles] = useState([]);


    return (
        <div>
            <div className={styles.center}>
                <div className={styles.top_text}>
                    <h1>Expand Your <span className={styles.colored_text}>Devs</span> Team</h1>
                    <h4>Discover highly skilled <span className={styles.colored_text}>devs</span></h4>
                
                </div>
            </div>
            <ProfileGrid/>

        </div>
    )
}

export default ExplorePage