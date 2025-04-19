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
/*
export const realLogin = async (username, password) => {
  const hash = await hashPassword(password)
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, passwordHash: hash })
  })

  if (!res.ok) throw new Error('Unauthorized')
  return await res.json()
}
*/
