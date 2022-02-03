import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faExclamationTriangle, faTimes } from "@fortawesome/free-solid-svg-icons";

import { runningStatus } from '../../utils/constants'

import styles from "./Notification.module.css";
import cn from 'classname'

const Notification = ({ status }) => {
  return (
    <div className={styles['notification-container']}>
      {status === runningStatus.STATUS_SUCCESS && (
        <div className={cn(styles['notification-content'], styles.success)}>
          <span>Transaction successfully approved</span>
          <FontAwesomeIcon icon={faArrowRight} />
          <a href="/portfolio">Go to Portfolio</a>
        </div>
      )} 
      {status === runningStatus.STATUS_ERROR && (
        <div className={cn(styles['notification-content'], styles.error)}>
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>Transaction failed</span>
        </div>
      )}
      {status === runningStatus.STATUS_LOADING && (
        <div className={cn(styles['notification-content'], styles.loading)}>
          {`Your transaction is being confirmed. Estimated Duration: <2 mins>`}
        </div>
      )}
    </div>
  )
}

export default Notification
