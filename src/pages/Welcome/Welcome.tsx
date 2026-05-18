import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './Welcome.module.css'

export default function Welcome() {
  const location = useLocation()
  const navigate = useNavigate()
  const username = (location.state as { username?: string })?.username ?? 'Friend'

  useEffect(() => {
    const id = setTimeout(() => navigate('/main'), 2000)
    return () => clearTimeout(id)
  }, [navigate])

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <span className={styles.hello}>Hello</span>
        <span className={styles.name}>{username}</span>
      </div>

      <div className={styles.dogWrapper}>
        <img className={styles.dog} src="/dog.png" alt="" />
      </div>
    </div>
  )
}
