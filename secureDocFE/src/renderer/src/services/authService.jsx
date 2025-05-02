// Mock uživatelé s hashovanými hesly a rolemi

const USERS = {
  admin: {
    hash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', // '1234'
    role: 'admin'
  },
  user: {
    hash: '05d49692b755f99c4504b510418efeeeebfd466892540f27acf9a31a326d6504', // 'userpass'
    role: 'user'
  }
}

const API = import.meta.env.VITE_API_PATH

export const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const fakeLogin = async (username, password) => {
  const hash = await hashPassword(password)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (USERS[username] && USERS[username].hash === hash) {
        resolve({ user: username, role: USERS[username].role })
      } else {
        reject(new Error('Invalid credentials'))
      }
    }, 500)
  })
}

// Reálný login pro pozdější nasazení backendu

export const realLogin = async (username, password) => {
  console.log(API)
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: username, password })
  })
  console.log(API)
  if (!res.ok) return { error: 'Incorrect Credentials!' }
  return await res.json()
}

export const getLoggedUser = async (token) => {
  const res = await fetch(`${API}/user/me`, {
    method: 'GET',
    headers: {
      'authorization-x': token
    }
  })
  if (!res.ok) return { error: 'Wrong!' }
  return await res.json()
}

export const registerUser = async (email, password) => {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) return { error: 'Wrong' }
  return await res.json()
}
