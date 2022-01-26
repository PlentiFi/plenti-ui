import React from 'react'

import styles from './PriceRange.module.css'

import cn from 'classname'

const PriceRange = ({ className, title, value, description }) => (
  <div className={cn(className, styles['price-range-item'])}>
    <span className={styles.min}>{title}</span>
    <span className={styles.value}>{value}</span>
    <span className={styles.per}>{description}</span>
  </div>
)

export default PriceRange
