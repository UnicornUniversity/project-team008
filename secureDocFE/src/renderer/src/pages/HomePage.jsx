import { useState } from 'react'
import LoginModal from '../components/LoginModal'
import { useStore } from '../context/StoreContext'

const HomePage = () => {
  const { setUser, setRole } = useStore()
  const [showLogin, setShowLogin] = useState(false)

  const handleLogin = (user, role) => {
    setUser(user)
    setRole(role)
    setShowLogin(false)
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h3>Welcome to SecureDoc</h3>

      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <button onClick={() => setShowLogin(true)}>Login</button>
        <button onClick={() => alert('Redirect to registration form (todo)')}>Register</button>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
    </div>
  )
}

export default HomePage
