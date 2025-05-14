// src/components/ArduinoConnectionSnackbar.jsx
import React, { useState, useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

export default function ArduinoConnectionSnackbar() {
  const [connected, setConnected] = useState(true)

  useEffect(() => {
    const stopConnect = window.api.onConnect(() => {
      setConnected(true)
    })

    const stopDisconnect = window.api.onDisconnect(() => {
      setConnected(false)
    })

    return () => {
      stopConnect()
      stopDisconnect()
    }
  }, [])

  return (
    <Snackbar open={!connected} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity="error" sx={{ width: '100%' }}>
        Arduino disconnected
      </Alert>
    </Snackbar>
  )
}
