import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { FiSun, FiMoon } from 'react-icons/fi'

const Navbar = () => {
  const { user, setUser, role, setRole, theme, setTheme } = useStore()
  const navigate = useNavigate()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleLogout = () => {
    setUser(null)
    setRole(null)
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
          borderBottom: '1px solid #ccc'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && (
            <>
              {role === 'admin' && (
                <button onClick={() => navigate('/admin')}>Administration</button>
              )}
              <button onClick={() => navigate('/files')}>File List</button>
              <button onClick={() => navigate('/files/download')}>Download</button>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span
            onClick={toggleTheme}
            style={{
              cursor: 'pointer',
              fontSize: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Toggle theme"
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </span>

          {user && (
            <>
              <span style={{ fontWeight: 'bold' }}>{user}</span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.4rem 0.8rem',
                  border: '1px solid #aaa',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'white'
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
