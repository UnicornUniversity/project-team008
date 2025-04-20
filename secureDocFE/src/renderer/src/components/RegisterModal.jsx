import { useState } from 'react'
import PropTypes from 'prop-types'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import '../assets/main.css'

const RegisterModal = ({ onClose }) => {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()

    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
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

    console.log('Registration request sent:', form)
    setNotification('Registration request sent to the administrator.')
    setTimeout(() => {
      resetAndClose()
    }, 3000)
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
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
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
