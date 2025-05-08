import { appStore } from '../store/appStore.js'

export async function request(path, data, method = 'POST', token = appStore.getState().token) {
  const apiUrl = import.meta.env.VITE_API_PATH
  const fullUrl = `${apiUrl}/${path}`

  console.log('actual token', token)

  try {
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'authorization-x': token || ''
      }
    }

    if (data !== undefined) {
      fetchOptions.body = JSON.stringify(data)
    }

    const response = await fetch(fullUrl, fetchOptions)

    if (!response.ok) {
      try {
        const errData = await response.json()
        return [new Error(errData.message), null]
      } catch {
        throw new Error(`API call failed: ${response.status} - ${response.statusText}`)
      }
    }

    console.log('response', response)

    if (response.status === 204) {
      return [null, true]
    }

    const result = await response.json()
    return [null, result]
  } catch (err) {
    return [err, null]
  }
}
