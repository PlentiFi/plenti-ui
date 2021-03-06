import React from 'react'

import styles from './ComingSoon.module.css'

const ComingSoon = () => (
  <div className={styles['comingsoon-container']}>
    <img src="/assets/coming-soon.png" />
    <a href="https://discord.gg/tfmktwrxNb" target="_blank">Join our community <img src="/assets/socials/discord-2.png" /></a>
  </div>
)

export default ComingSoon
