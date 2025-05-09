import { useEffect, useState } from 'react'
import { Box, Paper, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import logo from '../assets/logo.png'
import { useSerialListener } from '../hooks/useSerialListener'

export default function LockOverlay({ open, cancel, handlePin }) {
  const theme = useTheme()
  const [masked, setMasked] = useState('')

  const { startListening } = useSerialListener()

  const handleArduinoEvent = (event) => {
    if (event?.event === 'key') {
      console.log('masked', masked)
      setMasked((prev) => '•'.repeat(prev.length + 1))
    }
    if (event?.event === 'pin') {
      console.log('pin event!')
      handlePin({ arduinoId: event?.arduinoId, pin: event?.value })
      cancel()
    }
  }

  useEffect(() => {
    const stop = startListening(handleArduinoEvent)
    setMasked('')
    return () => {
      stop && stop()
      setMasked('')
    }
  }, [open, startListening])

  if (!open) return null

  return (
    <Box
      onClick={() => {
        cancel()
      }}
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
