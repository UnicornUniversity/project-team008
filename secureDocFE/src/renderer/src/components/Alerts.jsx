import React, { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useStore } from '../store/useStore.js'
import { appStore } from '../store/appStore.js'

export function Alerts() {
  const alerts = useStore(appStore, 'alerts')
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const keys = Object.keys(alerts)
    if (keys.length > 0) {
      const firstKey = keys[0]
      setMessage(alerts[firstKey])
      setOpen(true)
    }
  }, [alerts])

  const handleClose = () => {
    setOpen(false)
    appStore.setState({ alerts: {} })
  }

  console.log('alerts', alerts)

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      sx={{ m: 3 }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
