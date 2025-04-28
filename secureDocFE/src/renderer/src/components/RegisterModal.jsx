import { useState } from 'react'
import PropTypes from 'prop-types'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import '../assets/main.css'
import { registerUser } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import { getLoggedUser, realLogin } from '../services/authService'

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

    if ( !form.email || !form.password || !form.confirmPassword) {
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
      <div className="login-modal-content">
        <h2>Register</h2>
        <form
          onSubmit={handleRegisterSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
        
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Password Field */}
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
            <span onClick={() => setShowPassword((prev) => !prev)} className="password-toggle-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div style={{ position: 'relative' }}>
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={{ paddingRight: '2.5rem' }}
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="password-toggle-icon"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">Sign up</button>
          {error && <span style={{ color: 'red' }}>{error}</span>}
        </form>

        {notification && <div style={{ marginTop: '0.5rem', color: 'green' }}>{notification}</div>}

        <button onClick={resetAndClose} style={{ marginTop: '0.5rem' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

RegisterModal.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default RegisterModal
