// src/renderer/src/hooks/useUser.js
import { request } from '../api/request.js'
import { addAlert } from '../utils/addAlert.js'

export function useUser() {
  /**
   * Fetch all users
   * GET /users
   */
  async function fetchAll() {
    const [error, users] = await request('user', undefined, 'GET')
    if (error) {
      console.error('Error fetching users:', error)
      addAlert({ key: 'fetchUsers', message: error.message })
      return null
    }
    return users
  }

  /**
   * Fetch current logged-in user
   * GET /user/me
   */
  async function fetchMe() {
    const [error, me] = await request('user/me', undefined, 'GET')
    if (error) {
      console.error('Error fetching current user:', error)
      addAlert({ key: 'fetchMe', message: error.message })
      return null
    }
    return me
  }

  /**
   * Fetch a user by ID
   * GET /user/:id
   */
  async function fetchById(id) {
    const [error, user] = await request(`user/${id}`, undefined, 'GET')
    if (error) {
      console.error(`Error fetching user ${id}:`, error)
      addAlert({ key: `fetchUser:${id}`, message: error.message })
      return null
    }
    return user
  }

  /**
   * Update a user by ID
   * PUT /user/:id
   */
  async function updateUser(id, updates) {
    const [error, updated] = await request(`user/${id}`, updates, 'PUT')
    if (error) {
      console.error(`Error updating user ${id}:`, error)
      addAlert({ key: `updateUser:${id}`, message: error.message })
      return null
    }
    return updated
  }

  /**
   * Delete a user by ID
   * DELETE /user/:id
   */
  async function deleteUser(id) {
    const [error] = await request(`user/${id}`, undefined, 'DELETE')
    if (error) {
      console.error(`Error deleting user ${id}:`, error)
      addAlert({ key: `deleteUser:${id}`, message: error.message })
      return false
    }
    return true
  }

  return {
    fetchAll,
    fetchMe,
    fetchById,
    updateUser,
    deleteUser
  }
}
