import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography
} from '@mui/material'
import logo from '../assets/logo.png'
import { useAuthentication } from '../hooks/useAuthentication.js'
import { useUser } from '../hooks/useUser.js'
import { appStore } from '../store/appStore.js'
import { useNavigate } from 'react-router-dom'

const AuthModal = ({ open, mode, onClose, onSwitchMode }) => {
  const isLogin = mode === 'login'
  const { login, register } = useAuthentication()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const { fetchMe } = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all required fields.')
      return
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      if (isLogin) {
        const result = await login({ email, password })
        if (result) {
          appStore.setState({ token: result.token })
          const user = await fetchMe()
          if (user) {
            appStore.setState({ user })
            navigate('/files')
          }
        }
      } else {
        const regResult = await register({ name, email, password })
        if (regResult) {
          const result = await login({ email, password })
          if (result) {
            appStore.setState({ token: result.token })
            const user = await fetchMe()
            if (user) {
              appStore.setState({ user })
              navigate('/files')
            }
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
        <Box
          component="img"
          src={logo}
          draggable={false}
          alt="SecureDoc"
          sx={{ width: 140, mx: 'auto', mb: -3.5, mt: -3.5 }}
        />
      </DialogTitle>

      <DialogContent dividers>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {!isLogin && (
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
          )}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          {!isLogin && (
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              error={confirmPassword !== password}
              helperText={confirmPassword !== password && 'Passwords must match'}
            />
          )}

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1 }}>
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Typography variant="body2">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <Button onClick={onSwitchMode} size="small">
            {isLogin ? 'Register' : 'Login'}
          </Button>
        </Typography>
      </DialogActions>
    </Dialog>
  )
}

export default AuthModal
