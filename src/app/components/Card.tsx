'use client'

import React from 'react';
import styles from './card.module.css'; // Make sure to import your CSS file

export const CustomCard = ({ title, description, buttonText }) => {
  const descriptionLines = description.split("\\n").map((line) => line.trim());
  const isPlusCard = title.includes("+");

  return (
    <div className={styles.parent_container}>
      <div className={styles.first_inner_div}></div>
      <div className={styles.second_inner_div}></div>
      <div className={styles.third_inner_div}>
        <div className={styles.fourth_inner_div}>
          <span className={styles.premium_text}>
            {isPlusCard ? (
              <span>
                {title.substring(0, title.indexOf("+"))}
                <span className={styles.plus_text} style={{ color: "#FFB000" }}>
                  +
                </span>
              </span>
            ) : (
              title
            )}
          </span>
        </div>
        <div className={styles.features_text}>
          {descriptionLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>
      <div className={styles.purchase_container}>
        <button className={styles.purchase_button}></button>
        <div className={styles.purchase_text}>{buttonText}</div>
      </div>
      <div className={styles.divider_line}></div>
    </div>
  );
};

export default CustomCard;