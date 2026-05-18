import { useNavigate } from 'react-router-dom'
import styles from './Landing.module.css'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <h1 className={styles.brand}>Lumit</h1>
      <p className={styles.description}>Some Description for the picture</p>

      <button className={styles.btnPrimary} onClick={() => navigate('/phone')}>
        Sign up with Phone
      </button>

      <button className={styles.btnSecondary} onClick={() => navigate('/phone', { state: { isSignIn: true } })}>
        Already have an account? <span className={styles.btnSecondaryBold}>Log in</span>
      </button>

      <p className={styles.privacy}>
        By continuing, I confirm that I am 16 or older and agree to the{' '}
        <span className={styles.privacyLink}>Terms</span> and{' '}
        <span className={styles.privacyLink}>Privacy Policy</span>
      </p>
    </div>
  )
}
