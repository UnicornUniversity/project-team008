import { useEffect, useState, useCallback } from 'react'

export function useSerialListener() {
  const [log, setLog] = useState([])
  const [connected, setConnected] = useState(false)

  const startListening = useCallback((handleArduinoEvent) => {
    if (!window.api) {
      console.warn('❌ Electron API not available.')
      return
    }

    const stop = window.api.onLine((line) => {
      try {
        const parsed = JSON.parse(line)
        setLog((prev) => [...prev, parsed])
        console.log('📥 Serial Event:', parsed)
        handleArduinoEvent(parsed)
      } catch (e) {
        console.warn('⚠️ Invalid JSON:', line)
        console.error('Error:', e)
      }
    })

    window.api.write('START')
    setConnected(true)
    return stop
  }, [])

  const sendLine = (text) => {
    if (window.api) {
      window.api.write(text)
    }
  }

  return { startListening, sendLine, log, connected }
}
