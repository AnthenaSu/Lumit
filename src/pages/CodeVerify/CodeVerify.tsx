import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './CodeVerify.module.css'

interface LocationState {
  phone?: string
  isSignIn?: boolean
}

const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function CodeVerify() {
  const [code, setCode] = useState('')
  const [timer, setTimer] = useState(59)
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const phone = state?.phone ?? '0432 222 222'
  const isSignIn = state?.isSignIn ?? false
  const canVerify = code.trim().length === 6

  useEffect(() => {
    if (timer <= 0) return
    const id = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer])

  return (
    <div className={styles.page}>
      <h1 className={styles.brand}>Lumit</h1>

      <button className={styles.back} onClick={() => navigate(-1)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <p className={styles.subtitle}>Sign in to continue</p>

      <p className={styles.phoneLabel}>Phone Number</p>
      <span className={styles.arrowPhone}><ArrowRight /></span>
      <span className={styles.phoneValue}>{phone}</span>

      <p className={styles.codeLabel}>Enter the code</p>
      <span className={styles.arrowCode}><ArrowRight /></span>

      <input
        className={styles.input}
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        placeholder="123456"
        autoFocus
      />

      {timer > 0 ? (
        <p className={styles.resend}>
          Didn&apos;t receive? resend in {timer} seconds
        </p>
      ) : (
        <p className={`${styles.resend} ${styles.resendActive}`} onClick={() => { setTimer(59); setCode('') }}>
          Didn&apos;t receive?{' '}
          <span className={styles.resendAction}>Resend</span>
        </p>
      )}

      <button
        className={`${styles.btn} ${canVerify ? styles.btnActive : styles.btnDisabled}`}
        onClick={() => canVerify && navigate(isSignIn ? '/welcome' : '/username')}
        disabled={!canVerify}
      >
        Verify
      </button>
    </div>
  )
}
