import { Routes, Route, Navigate } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame/PhoneFrame'
import Landing from './pages/Landing/Landing'
import PhoneInput from './pages/PhoneInput/PhoneInput'
import CodeVerify from './pages/CodeVerify/CodeVerify'
import Username from './pages/Username/Username'
import Welcome from './pages/Welcome/Welcome'
import Main from './pages/Main/Main'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.wrapper}>
      <PhoneFrame>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/phone" element={<PhoneInput />} />
          <Route path="/verify" element={<CodeVerify />} />
          <Route path="/username" element={<Username />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/main" element={<Main />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PhoneFrame>
    </div>
  )
}
