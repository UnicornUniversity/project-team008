import { useState } from 'react'
import PropTypes from 'prop-types'
import { fakeLogin } from '../services/authService'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const LoginModal = ({ onClose, onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const data = await fakeLogin(form.username, form.password)
      onLogin(data.user, data.role)
      resetAndClose()
      navigate(data.role === 'admin' ? '/admin' : '/files')
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Login failed. Please try again.')
    }
  }

  const handleForgotPassword = () => {
    setNotification(`Password reset request sent for user "${form.username}"`)
    setTimeout(() => setNotification(''), 4000)
  }

  const resetAndClose = () => {
    setForm({ username: '', password: '' })
    setError(null)
    setNotification('')
    onClose()
  }

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <h2>Login</h2>
        <form
          onSubmit={handleLoginSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <div style={{ position: 'relative' }}>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ paddingRight: '2.5rem' }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: 'absolute',
                right: '0.8rem',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit">Submit</button>
          {error && <span style={{ color: 'red' }}>{error}</span>}
        </form>

        {form.username && (
          <button onClick={handleForgotPassword} style={{ marginTop: '0.5rem' }}>
            Forgot password?
          </button>
        )}

        {notification && <div style={{ marginTop: '0.5rem', color: 'green' }}>{notification}</div>}

        <button onClick={resetAndClose} style={{ marginTop: '0.5rem' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  content: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '0.5rem',
    minWidth: '300px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column'
  }
}

LoginModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired
}

export default LoginModal
