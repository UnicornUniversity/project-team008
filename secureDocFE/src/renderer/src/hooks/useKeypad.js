import { useCallback, useEffect, useRef, useState } from 'react'

export function useKeypad({ stopKey = '#' } = {}) {
  const isIPC = !!window.api?.onLine
  const [history, setHistory] = useState([])
  const [listening, setListening] = useState(false)
  const buffer = useRef([])
  const active = useRef(false)
  const port = useRef(null)
  const reader = useRef(null)

  const flush = () => {
    setHistory([...buffer.current])
    buffer.current = []
  }

  const stopWebSerial = async () => {
    active.current = false
    setListening(false)
    flush()
    if (reader.current) {
      try {
        await reader.current.cancel()
      } catch {}
    }
    reader.current = null
  }

  const stopIPC = () => {
    active.current = false
    setListening(false)
    flush()
  }

  const handleLine = useCallback(
    (line) => {
      if (!active.current || line === '') return
      if (line === stopKey) {
        isIPC ? stopIPC() : stopWebSerial()
      } else {
        buffer.current.push(line)
        setHistory([...buffer.current])
      }
    },
    [isIPC, stopKey]
  )

  useEffect(() => {
    if (isIPC) {
      const unsub = window.api.onLine(handleLine)
      return () => unsub && unsub()
    }
  }, [handleLine, isIPC])

  const startIPC = () => {
    buffer.current = []
    setHistory([])
    active.current = true
    setListening(true)
  }

  const startWebSerial = async () => {
    if (!navigator.serial) return
    if (!port.current) {
      port.current = await navigator.serial.requestPort()
      await port.current.open({ baudRate: 9600 })
    }
    const decoder = new TextDecoderStream()
    port.current.readable.pipeTo(decoder.writable)
    reader.current = decoder.readable.getReader()
    buffer.current = []
    setHistory([])
    active.current = true
    setListening(true)
    ;(async () => {
      while (active.current) {
        const { value, done } = await reader.current.read()
        if (done) break
        handleLine((value || '').trim())
      }
    })()
  }

  const toggle = useCallback(() => {
    if (listening) {
      isIPC ? stopIPC() : stopWebSerial()
    } else {
      isIPC ? startIPC() : startWebSerial()
    }
  }, [isIPC, listening])

  const write = (txt) => {
    if (window.api?.write) {
      window.api.write(txt)
    } else if (port.current?.writable) {
      const encoder = new TextEncoder()
      port.current.writable.getWriter().write(encoder.encode(`${txt}\n`))
    }
  }

  return { history, listening, toggle, write }
}
