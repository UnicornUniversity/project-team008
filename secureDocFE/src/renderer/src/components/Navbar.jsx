//Navbar.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import LoginModal from './LoginModal'
import { FiSun, FiMoon } from 'react-icons/fi'

const Navbar = () => {
  const { user, setUser, role, setRole, theme, setTheme } = useStore()
  const [showLogin, setShowLogin] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleLogout = () => {
    setUser(null)
    setRole(null)
    setShowUserMenu(false)
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
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: '#eee',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && (
            <>
              {role === 'admin' && <button onClick={() => navigate('/admin')}>Login Page</button>}
              <button onClick={() => navigate('/files')}>File List</button>
              <button onClick={() => navigate('/files/detail')}>Detail</button>
              <button onClick={() => navigate('/files/download')}>Download</button>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
          {/* Ikona pro přepnutí tématu */}
          <span
            onClick={toggleTheme}
            style={{
              cursor: 'pointer',
              fontSize: '1.5rem',
              padding: '0.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Toggle theme"
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </span>

          {user && (
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowUserMenu((prev) => !prev)}
                style={{ fontWeight: 'bold', cursor: 'pointer' }}
              >
                {user}
              </div>
              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '2rem',
                    background: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '0.3rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    zIndex: 1000
                  }}
                >
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={(user, role) => {
            setUser(user)
            setRole(role)
          }}
        />
      )}
    </>
  )
}

export default Navbar
