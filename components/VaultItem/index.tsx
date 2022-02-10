import DescriptionBadge from './DescriptionBadge'

import styles from './VaultItem.module.css'
import cn from 'classname'

const VaultItem = ({
  name,
  fee,
  badges,
  onSelectVault,
  hover = false
}) => {
  return (
    <div
      className={cn(styles["vault-item-container"], { [styles.hover]: hover })}
      role="button"
      onClick={(e) => onSelectVault()}
    >
      <div className={styles["vault-item-icon"]}>
        <img src="/assets/tokens/eth-usdt.png" />
      </div>
      <div className={styles['vault-item-content']}>
        <div className={styles["vault-item-title"]}>
          <span className={styles.desktop}>{`${name} / ${fee}%`}</span>
        </div>
        <div className={styles["vault-item-badges"]}>
          {badges.map((item) => (<DescriptionBadge key={`vault-${name}-badge-${item}`} badge={item} className={styles['vault-item-badge']} />))}
        </div>
      </div>
    </div>
  )
}

export default VaultItem
