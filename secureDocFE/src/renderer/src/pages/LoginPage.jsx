import React, { useState } from 'react'
import { Box, Button } from '@mui/material'
import AuthModal from '../components/AuthModal'
import logo from '../assets/logo.png'
import LockIcon from '@mui/icons-material/LockOutlined'

const LoginPage = () => {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('login')

  const handleOpen = (m) => {
    setMode(m)
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  return (
    <Box
      sx={{
        height: 'calc(100vh - 20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: 'background.default'
      }}
    >
      <Box component="img" src={logo} alt="SecureDoc Logo" sx={{ width: 250, mb: 4, mt: -4 }} />

      <Button
        startIcon={<LockIcon />}
        sx={{ mt: -6 }}
        variant="outlined"
        onClick={() => handleOpen('login')}
      >
        Unlock
      </Button>

      <AuthModal
        open={open}
        mode={mode}
        onClose={handleClose}
        onSwitchMode={() => setMode((prev) => (prev === 'login' ? 'register' : 'login'))}
      />
    </Box>
  )
}

export default LoginPage
