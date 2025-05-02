import React, { useEffect, useRef, useState } from 'react'

export const KeypadListener = () => {
  const [listening, setListening] = useState(false)
  const [history, setHistory] = useState([])
  const bufferRef = useRef([])
  const listeningRef = useRef(false)

  const finish = () => {
    listeningRef.current = false
    setListening(false)
    setHistory([...bufferRef.current])
    console.log('[UI] finished – recorded:', bufferRef.current.join(''))
    bufferRef.current = []
  }

  const toggle = () => {
    if (listening) {
      finish()
    } else {
      bufferRef.current = []
      setHistory([])
      listeningRef.current = true
      setListening(true)
      console.log('[UI] started listening')
    }
  }

  useEffect(() => {
    const handler = (raw) => {
      const line = raw.trim()
      if (!listeningRef.current || line === '') return
      if (line === '#') {
        finish()
      } else {
        bufferRef.current.push(line)
        setHistory([...bufferRef.current])
      }
    }
    let unsub
    if (window.api?.onLine) unsub = window.api.onLine(handler)
    return () => {
      if (unsub) unsub()
    }
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h2>Keypad logger</h2>
      <button onClick={toggle} style={{ padding: '6px 14px' }}>
        {listening ? 'Stop' : 'Start'} listening
      </button>
      <pre style={{ marginTop: 16, background: '#fafafa', padding: 12 }}>
        {history.length === 0 ? '(no data yet)' : history.join(' ')}
      </pre>
    </div>
  )
}
