import { useState } from 'react'
import PropTypes from 'prop-types'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import '../assets/main.css'
import { registerUser } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import { getLoggedUser, realLogin } from '../services/authService'
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Typography
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const RegisterModal = ({ onClose, onLogin }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [notification, setNotification] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()

    if (!form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (!isValidEmail(form.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const data = await registerUser(form.email, form.password)
    console.log(data)
    if (data.error == undefined) {
      const data = await realLogin(form.email, form.password)

      if (data.token != undefined) {
        const user = await getLoggedUser(data.token)
        onLogin(user.email, user.role, data.token, user)
        resetAndClose()
        navigate(data.role === 'admin' ? '/admin' : '/files')
      } else {
        setError(data.error)
      }
    } else {
      setNotification('Could not register.')
    }
  }

  const resetAndClose = () => {
    setForm({ username: '', email: '', password: '', confirmPassword: '' })
    setNotification('')
    setError(null)
    onClose()
  }

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content modal">
        <Typography variant="h4">Register</Typography>
        <form
          onSubmit={handleRegisterSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <InputLabel className="modal-label" htmlFor="outlined-email" sx={{ textAlign: 'left' }}>
            Email
          </InputLabel>
          <OutlinedInput
            className="modal-input"
            id="outlined-email"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required={true}
          />

          {/* Password Field */}
          <div style={{ position: 'relative' }}>
            <InputLabel
              className="modal-label"
              htmlFor="outlined-password"
              sx={{ textAlign: 'left' }}
            >
              Password
            </InputLabel>
            <OutlinedInput
              className="modal-input"
              id="outlined-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required={true}
              style={{ paddingRight: '2.5rem' }}
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

          {/* Confirm Password Field */}
          <div style={{ position: 'relative' }}>
            <InputLabel
              className="modal-label"
              htmlFor="outlined-confirm-password"
              sx={{ textAlign: 'left' }}
            >
              Confirm Password
            </InputLabel>
            <OutlinedInput
              className="modal-input"
              id="outlined-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required={true}
              style={{ paddingRight: '2.5rem' }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showConfirmPassword ? 'hide the password' : 'display the password'}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </div>

          <Button variant="contained" type="submit">
            Sign up
          </Button>
          {error && <span style={{ color: 'red' }}>{error}</span>}
        </form>

        {notification && <div style={{ marginTop: '0.5rem', color: 'green' }}>{notification}</div>}

        <Button variant="contained" onClick={resetAndClose} style={{ marginTop: '0.5rem' }}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

RegisterModal.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default RegisterModal
