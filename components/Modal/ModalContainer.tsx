import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import Mask from './Mask'

import styles from './Modal.module.css'

const ModalContainer = ({ children, onClose }) => (
  <>
    <Mask />
    <div className={styles['modal-container']}>
      <div className={styles['modal-content']}>
        <div className={styles['modal-header']}>
          <FontAwesomeIcon icon={faTimes} onClick={(e) => onClose()} />
        </div>
        <div className={styles['modal-view']}>
          {children}
        </div>
      </div>
    </div>
  </>
)

export default ModalContainer