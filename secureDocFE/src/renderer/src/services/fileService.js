const API = import.meta.env.VITE_API_PATH || 'http://localhost:3000'

export async function uploadFile(file, token) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API}/file`, {
    method: 'POST',
    headers: {
      'authorization-x': token
    },
    body: formData
  })

  if (!res.ok) throw new Error('Upload failed')
  return await res.json()
}

export async function getAllFiles(token) {
  const res = await fetch(`${API}/file`, {
    method: 'GET',
    headers: {
      'authorization-x': token
    }
  })

  if (!res.ok) throw new Error('Failed to fetch files')
  return await res.json()
}
