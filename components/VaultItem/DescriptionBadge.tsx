import styles from "./VaultItem.module.css";
import cn from 'classname';

/**
 * BadgeType : "ETHEREUM" | "UNISWAP V3" | "PLENTI";
 */
const BadgeColors = {
  ETHEREUM: "#7291E3",
  "UNISWAP V3": "#EE46BC",
  PLENTI: "#CFCFD0",
};

const DescriptionBadge = ({ badge, className = '' }) => (
  <div
    className={cn(className, styles["vault-description-badge-container"])}
    style={{ background: BadgeColors[badge] }}
  >
    {badge}
  </div>
);

export default DescriptionBadge;
