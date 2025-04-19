//authService.jsx
// This is a mock authentication service that simulates a login process.

const USERS = {
  admin: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'
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
      if (USERS[username] && USERS[username] === hash) {
        resolve({ user: username })
      } else {
        reject(new Error('Invalid credentials'))
      }
    }, 500)
  })
}
//Až nasadíme backend, stačí nahradit fakeLogin() reálným fetch(), viz níže
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
