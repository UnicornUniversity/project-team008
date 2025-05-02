import React from 'react'
import { useKeypad } from '../hooks/useKeypad'

export const KeypadListener = () => {
  const { listening, history, toggle } = useKeypad()

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
