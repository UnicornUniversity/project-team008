import { useState, useRef, useCallback, useEffect } from 'react'

export function useLockOverlay() {
  const [open, setOpen] = useState(false)
  const [pin, setPin] = useState('')
  const callbackRef = useRef(null)

  const startLock = useCallback((onFinish) => {
    callbackRef.current = onFinish
    setPin('')
    setOpen(true)
    console.log('setting open to', true)
  }, [])

  const addDigit = useCallback((digit) => {
    setPin((p) => (p.length < 10 ? p + digit : p))
  }, [])

  const pressHash = useCallback(() => {
    setOpen(false)
    if (typeof callbackRef.current === 'function') {
      callbackRef.current(pin)
    }
  }, [pin])

  const cancel = useCallback(() => {
    setOpen(false)
  }, [])

  console.log('open', open)

  useEffect(() => {
    console.log('this is open', open)
  }, [open])

  return { open, pin, startLock, addDigit, pressHash, cancel }
}
