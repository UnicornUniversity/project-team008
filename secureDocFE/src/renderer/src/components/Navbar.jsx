// src/components/Navbar.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import LoginModal from './LoginModal'

const Navbar = () => {
  const { user, setUser, theme, setTheme } = useStore()
  const [showLogin, setShowLogin] = useState(false)
  const navigate = useNavigate()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleLogout = () => {
    setUser(null)
    navigate('/')
  }

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  return (
    <>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '1rem',
          backgroundColor: '#eee'
        }}
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          {!user ? (
            <button onClick={() => setShowLogin(true)}>Login</button>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
          <button onClick={toggleTheme}>{theme === 'light' ? 'Light' : 'Dark'}</button>
        </div>
        <div style={{ fontWeight: 'bold' }}>{user && `${user}`}</div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={setUser} />}
    </>
  )
}

export default Navbar
