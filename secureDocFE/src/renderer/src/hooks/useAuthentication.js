import { request } from '../api/request.js'
import { addAlert } from '../utils/addAlert.js'

export function useAuthentication() {
  async function login(credentials) {
    const [error, result] = await request('auth/login', credentials)
    if (error) {
      console.error('Error logging in:', error)
      addAlert({ key: 'login', message: error.message })
      return null
    }
    return result
  }

  async function register(userDetails) {
    const [error, result] = await request('auth/register', userDetails)
    if (error) {
      console.error('Error registering:', error)
      addAlert({ key: 'register', message: error.message })
      return null
    }
    return result
  }

  return { login, register }
}
