import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Username.module.css'

export default function Username() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()
  const canSave = username.trim().length >= 2

  return (
    <div className={styles.page}>
      <div className={styles.topSection}>
        <h1 className={styles.title}>Choose a Username</h1>
        <p className={styles.subtitle}>This is how others will find you on Lumit.</p>
      </div>

      <span className={styles.label}>Username</span>

      <div className={styles.inputWrapper}>
        <span className={styles.at}>@</span>
        <input
          className={styles.input}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ian Lin"
          autoFocus
          autoCapitalize="none"
          autoCorrect="off"
        />
        {canSave && (
          <span className={styles.checkIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#000" strokeWidth="1.5" />
              <path d="M6 10.5l3 3 5-6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>

      <button
        className={`${styles.btn} ${canSave ? styles.btnActive : styles.btnDisabled}`}
        onClick={() => canSave && navigate('/welcome', { state: { username } })}
        disabled={!canSave}
      >
        Save
      </button>
    </div>
  )
}
