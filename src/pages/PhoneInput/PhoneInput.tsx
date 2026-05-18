import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './PhoneInput.module.css'

export default function PhoneInput() {
  const [phone, setPhone] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const isSignIn = (location.state as { isSignIn?: boolean } | null)?.isSignIn ?? false
  const canSend = phone.trim().length >= 6

  return (
    <div className={styles.page}>
      <h1 className={styles.brand}>Lumit</h1>

      <button className={styles.back} onClick={() => navigate(-1)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <p className={styles.subtitle}>Sign in to continue</p>

      <p className={styles.fieldLabel}>Phone Number</p>

      <span className={styles.arrow}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      <input
        className={styles.input}
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="0432 222 222"
        autoFocus
      />

      <button
        className={`${styles.btn} ${canSend ? styles.btnActive : styles.btnDisabled}`}
        onClick={() => canSend && navigate('/verify', { state: { phone, isSignIn } })}
        disabled={!canSend}
      >
        Send code
      </button>
    </div>
  )
}
