// src/components/ArduinoConnectionSnackbar.jsx
import React, { useState, useEffect, useRef } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

const TIMEOUT = 5000

export default function ArduinoConnectionSnackbar() {
  const [connected, setConnected] = useState(true)
  const timerRef = useRef()

  useEffect(() => {
    timerRef.current = setTimeout(() => setConnected(false), TIMEOUT)

    const stopLine = window.api.onLine(() => {
      setConnected(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setConnected(false), TIMEOUT)
    })

    const stopConnect = window.api.onConnect(() => {
      setConnected(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setConnected(false), TIMEOUT)
    })

    return () => {
      stopLine()
      stopConnect()
      clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <Snackbar open={!connected} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity="error" sx={{ width: '100%' }}>
        Arduino disconnected{' '}
        {import.meta.env.VITE_ARDUINO_PORT
          ? '( Expecting MOCK Arduino )'
          : '( Expecting Hardware ARDUINO )'}
      </Alert>
    </Snackbar>
  )
}
