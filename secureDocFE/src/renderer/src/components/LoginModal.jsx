// LoginModal.jsx
import { useState } from 'react'
import PropTypes from 'prop-types'
import { getLoggedUser, realLogin } from '../services/authService'
import { FiRefreshCw } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import '../assets/main.css'
import { Button, TextField } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

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
      const data = await realLogin(form.username, form.password)

      if (data.token != undefined) {
        const user = await getLoggedUser(data.token)
        onLogin(user.email, user.role, data.token, user)
        resetAndClose()
        navigate(data.role === 'admin' ? '/admin' : '/files')
      } else {
        setError(data.error)
      }

      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      //setError('Login failed. Please try again.')
      setError(err)
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
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <h2>Login</h2>
        <form
          onSubmit={handleLoginSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <TextField //pouzit materialUI : mui.com
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <div style={{ position: 'relative' }}>
            <TextField
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ paddingRight: '2.5rem' }}
            />
            <span onClick={() => setShowPassword((prev) => !prev)} className="password-toggle-icon">
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </span>
          </div>
          <Button type="submit">Log in</Button>
          {error && <span style={{ color: 'red' }}>{error}</span>}
        </form>

        {form.username && (
          <span
            onClick={handleForgotPassword}
            title="password recovery"
            style={{
              marginTop: '0.5rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#888',
              fontSize: '0.95rem'
            }}
          >
            <FiRefreshCw />
            password recovery
          </span>
        )}

        {notification && <div style={{ marginTop: '0.5rem', color: 'green' }}>{notification}</div>}

        <Button onClick={resetAndClose} style={{ marginTop: '0.5rem' }}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

LoginModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired
}

export default LoginModal
