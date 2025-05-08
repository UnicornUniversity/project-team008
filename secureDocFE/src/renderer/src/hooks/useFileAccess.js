// src/renderer/src/hooks/useFileAccess.js
import { request } from '../api/request.js'
import { addAlert } from '../utils/addAlert.js'

export function useFileAccess() {
  /**
   * List all access entries for a given file
   * GET /file/:id/user
   * @param {string|number} fileId
   * @returns {Promise<Array|null>}
   */
  async function listForFile(fileId) {
    const [error, list] = await request(`file/${fileId}/user`, undefined, 'GET')
    if (error) {
      console.error(`Error listing access for file ${fileId}:`, error)
      addAlert({ key: `listAccess:${fileId}`, message: error.message })
      return null
    }
    return list
  }

  /**
   * Grant read or write access on a file to a user
   * POST /file/:id/user
   * @param {string|number} fileId
   * @param {string} userId
   * @param {'read'|'write'} permission
   * @returns {Promise<Object|null>}
   */
  async function grantAccess(fileId, userId, permission = 'read') {
    const [error, entry] = await request(`file/${fileId}/user`, { userId, permission })
    if (error) {
      console.error(
        `Error granting ${permission} access to user ${userId} on file ${fileId}:`,
        error
      )
      addAlert({ key: `grantAccess:${fileId}:${userId}`, message: error.message })
      return null
    }
    return entry
  }

  return {
    listForFile,
    grantAccess
  }
}
