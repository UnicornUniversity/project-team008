import React from 'react'
import { Box, Paper, Typography, Grid, Button, Avatar, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import logo from '../assets/logo.png'
import { Image } from '@mui/icons-material'

export default function LockOverlay({ open, pin, addDigit, pressHash, cancel }) {
  const theme = useTheme()

  if (!open) return null

  const masked = '•'.repeat(pin.length)

  return (
    <Box
      onClick={cancel}
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: alpha(theme.palette.warning.main, 0.9),
        zIndex: 1400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        onClick={(e) => e.stopPropagation()}
        elevation={16}
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          width: 300,
          maxWidth: '90vw'
        }}
      >
        <Box sx={{ mx: 'auto', width: 190, height: 150, mt: -3, mb: 5 }}>
          <img draggable={false} src={logo} alt="SecureDoc" style={{ mx: 'auto', width: '100%' }} />
        </Box>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Use your SecureDoc
          <Typography variant="h6" color="warning">
            LOCKPAD
          </Typography>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter your PIN and press <strong>#</strong> when done
        </Typography>

        <Box sx={{ mb: 3, fontSize: '1.5rem', letterSpacing: 4, fontFamily: 'monospace' }}>
          {masked}
        </Box>
      </Paper>
    </Box>
  )
}
