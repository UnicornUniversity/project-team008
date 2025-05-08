// src/renderer/src/hooks/useDownload.js
import { appStore } from '../store/appStore.js'
import { addAlert } from '../utils/addAlert.js'

export function useDownload() {
  /**
   * Generate a short-lived download token and save the file to the user's PC.
   * @param {File} – the File
   * @param {string} [hardwarePin] – optional PIN for protected files
   * @returns {Promise<boolean>} – true on success, false on error
   */
  async function download(file, hardwarePin) {
    try {
      const token = appStore.getState().token
      const apiUrl = import.meta.env.VITE_API_PATH

      // 1) Request a download token
      const genRes = await fetch(`${apiUrl}/download/${file.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization-x': token || '',
          'hardware-pin': hardwarePin || ''
        }
      })
      if (!genRes.ok) {
        const errBody = await genRes.json().catch(() => ({}))
        throw new Error(errBody.message || 'Failed to generate download link')
      }
      const { download_url } = await genRes.json()

      // 2) Fetch the binary
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

      addAlert({
        key: `downloadFile:${file.id}`,
        severity: 'success',
        message: 'Download Success!XS'
      })

      return true
    } catch (err) {
      console.error('Error downloading file:', err)
      addAlert({ key: `downloadFile:${file.id}`, message: err.message })
      return false
    }
  }

  return { download }
}
