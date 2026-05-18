import { ReactNode } from 'react'
import styles from './PhoneFrame.module.css'

interface Props {
  children: ReactNode
}

export default function PhoneFrame({ children }: Props) {
  return (
    <div className={styles.outer}>
      <div className={styles.sideBtn} />
      <div className={styles.dynamicIsland} />
      <div className={styles.screen}>
        {children}
      </div>
      <div className={styles.homeIndicator} />
    </div>
  )
}
