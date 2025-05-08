// src/renderer/src/hooks/useFile.js
import { request } from '../api/request.js'
import { appStore } from '../store/appStore.js'
import { addAlert } from '../utils/addAlert.js'

export function useFile() {
  /**
   * List all files
   * GET /file
   */
  async function listAll() {
    const [error, files] = await request('file', undefined, 'GET')
    if (error) {
      console.error('Error listing files:', error)
      addAlert({ key: 'listFiles', message: error.message })
      return null
    }
    return files
  }

  /**
   * Fetch a single file's metadata
   * GET /file/:id
   */
  async function getById(id) {
    const [error, file] = await request(`file/${id}`, undefined, 'GET')
    if (error) {
      console.error(`Error fetching file ${id}:`, error)
      addAlert({ key: `getFile:${id}`, message: error.message })
      return null
    }
    return file
  }

  /**
   * Upload a new file
   * POST /file  (multipart/form-data)
   */
  async function upload(fileBlob, token) {
    token = token ?? appStore.getState().token

    const form = new FormData()
    form.append('file', fileBlob)
    const options = {
      method: 'POST',
      headers: {
        'authorization-x': token || ''
      },
      body: form
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_PATH}/file`, options)
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Upload failed')
      }
      return await res.json()
    } catch (error) {
      console.error('Error uploading file:', error)
      addAlert({ key: 'uploadFile', message: error.message })
      return null
    }
  }

  /**
   * Update file metadata
   * PUT /file/:id
   */
  async function updateFile(id, updates) {
    const [error, updated] = await request(`file/${id}`, updates, 'PUT')
    if (error) {
      console.error(`Error updating file ${id}:`, error)
      addAlert({ key: `updateFile:${id}`, message: error.message })
      return null
    }
    return updated
  }

  /**
   * Delete a file
   * DELETE /file/:id
   */
  async function deleteFile(id) {
    const [error] = await request(`file/${id}`, undefined, 'DELETE')
    console.log('error', error)
    if (error) {
      console.error(`Error deleting file ${id}:`, error)
      addAlert({ key: `deleteFile:${id}`, message: error.message })
      return false
    }
    return true
  }

  return {
    listAll,
    getById,
    upload,
    updateFile,
    deleteFile
  }
}
