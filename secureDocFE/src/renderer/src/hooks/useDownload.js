// src/renderer/src/hooks/useDownload.js
import { appStore } from '../store/appStore.js'
import { addAlert } from '../utils/addAlert.js'

export function useDownload() {
  /**
   * Generate a short-lived download token and save the file to the user's PC.
   * @param {File} file – the File meta object
   * @param {string} [hardwarePin] – optional PIN for protected files
   * @param {number} [arduinoId] – optional Arduino device ID
   * @returns {Promise<boolean>} – true on success, false on error
   */
  async function download(file, hardwarePin, arduinoId) {
    try {
      const token = appStore.getState().token
      const apiUrl = import.meta.env.VITE_API_PATH

      // 1) Request a download token+URL
      const genRes = await fetch(`${apiUrl}/download/${file.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization-x': token || ''
        },
        body: JSON.stringify({ hardwarePin, arduinoId })
      })
      if (!genRes.ok) {
        const errBody = await genRes.json().catch(() => ({}))
        throw new Error(errBody.message || 'Failed to generate download link')
      }
      const { download_url } = await genRes.json()

      // 2) Fetch the binary (pass your main auth token again)
      const fileRes = await fetch(download_url, {
        method: 'GET',
        headers: { 'authorization-x': token || '' }
      })
      if (!fileRes.ok) {
        throw new Error(`Download failed: ${fileRes.statusText}`)
      }
      const blob = await fileRes.blob()

      // 3) Determine filename from headers or fallback
      let filename = file.fileName
      const contentDisp = fileRes.headers.get('Content-Disposition')
      if (contentDisp) {
        const match = contentDisp.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/)
        if (match && match[1]) {
          filename = decodeURIComponent(match[1])
        }
      }

      // 4) Trigger browser save dialog
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      // success alert
      addAlert({
        key: `downloadFile:${file.id}`,
        severity: 'success',
        message: 'Download successful!'
      })
      return true
    } catch (err) {
      console.error('Error downloading file:', err)
      addAlert({
        key: `downloadFile:${file.id}`,
        severity: 'error',
        message: err.message
      })
      return false
    }
  }

  return { download }
}
