import styles from './Main.module.css'

const POSTS = [
  {
    id: 1,
    user: 'Anthena',
    location: 'Sydney',
    time: '1 hour ago',
    photo: '/assets/post1.jpg',
    caption:
      'A vase is an open, typically hollow container used for displaying flowers, storing items, or acting as decorative art, crafted from materials like glass, ceramic, metal, or wood',
  },
  {
    id: 2,
    user: 'ian.lin',
    location: 'Melbourne',
    time: '3 hours ago',
    photo: '/assets/post2.jpg',
    caption:
      'Stumbled upon the most incredible lamp at the Sunday market — sometimes the best finds are completely unplanned',
  },
]

function IconHome() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21V12h6v9" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconSend() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="#000" strokeWidth="1.5" />
      <path d="M21 21l-4.35-4.35" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Main() {
  return (
    <div className={styles.page}>
      <div className={styles.feed}>
        <header className={styles.header}>
          <span className={styles.brand}>Lumit</span>
        </header>

        {POSTS.map((post) => (
          <article key={post.id} className={styles.post}>
            <div className={styles.postHeader}>
              <span className={styles.username}>{post.user}</span>
              <img className={styles.avatar} src="/assets/cat.png" alt="" />
            </div>

            <img className={styles.photo} src={post.photo} alt="" />

            <p className={styles.caption}>{post.caption}</p>

            <p className={styles.meta}>{post.location} · {post.time}</p>
          </article>
        ))}
        </div>

      <nav className={styles.navPill}>
        <button className={styles.navBtn}><IconHome /></button>
        <button className={styles.navBtn}><IconSend /></button>
        <button className={`${styles.navBtn} ${styles.navBtnT}`}>T</button>
        <button className={styles.navBtn}><IconSearch /></button>
        <button className={styles.navBtn}><IconUser /></button>
      </nav>
    </div>
  )
}
