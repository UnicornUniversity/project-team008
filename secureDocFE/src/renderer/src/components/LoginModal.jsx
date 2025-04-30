// LoginModal.jsx
import { useState } from 'react'
import PropTypes from 'prop-types'
import { getLoggedUser, realLogin } from '../services/authService'
import { FiRefreshCw } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import '../assets/main.css'
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Typography,
  Box
} from '@mui/material'
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
    console.log(e)
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
    <div className="login-modal-overlay ">
      <div className="login-modal-content modal">
        <Typography variant="h4">Login</Typography>
        <form
          onSubmit={handleLoginSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <InputLabel
            className="modal-label"
            htmlFor="outlined-adornment-email"
            sx={{ textAlign: 'left' }}
          >
            Email
          </InputLabel>
          <OutlinedInput
            className="modal-input"
            id="outlined-adornment-email"
            name="username"
            placeholder="Email"
            value={form.username}
            onChange={handleChange}
            required={true}
          />
          <div style={{ position: 'relative' }}>
            <InputLabel
              className="modal-label"
              htmlFor="outlined-adornment-password"
              sx={{ textAlign: 'left' }}
            >
              Password
            </InputLabel>
            <OutlinedInput
              className="modal-input"
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              onChange={handleChange}
              value={form.password}
              required={true}
              placeholder="Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </div>
          <Button variant="contained" type="submit">
            Log in
          </Button>
        </form>

        <Button variant="contained" onClick={resetAndClose} style={{ marginTop: '0.5rem' }}>
          Cancel
        </Button>
        {error && <span style={{ color: 'red' }}>{error}</span>}
        {form.username && (
          <span
            onClick={handleForgotPassword}
            title="password recovery"
            style={{
              marginTop: '0.5rem',
              cursor: 'pointer',
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
      </div>
    </div>
  )
}

LoginModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired
}

export default LoginModal
