import { useState, useEffect, useCallback } from 'react'

/**
 * Listen for drag/drop anywhere on the window.
 * Calls `onFiles` with a FileList when files are dropped.
 * Returns `isDragging` boolean.
 */
export function useFileDrop(onFiles) {
  const [isDragging, setIsDragging] = useState(false)

  // We use a counter to handle nested dragenter/dragleave events
  const dragCounter = { count: 0 }

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    dragCounter.count += 1
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    dragCounter.count -= 1
    if (dragCounter.count <= 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      dragCounter.count = 0
      setIsDragging(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length) {
        onFiles(e.dataTransfer.files)
      }
    },
    [onFiles]
  )

  useEffect(() => {
    window.addEventListener('dragenter', handleDragEnter)
    window.addEventListener('dragleave', handleDragLeave)
    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('drop', handleDrop)

    return () => {
      window.removeEventListener('dragenter', handleDragEnter)
      window.removeEventListener('dragleave', handleDragLeave)
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('drop', handleDrop)
    }
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop])

  return isDragging
}
