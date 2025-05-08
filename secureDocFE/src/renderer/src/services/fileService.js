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

export async function getFileById(id, token) {
  const res = await fetch(`${API}/file/${id}`, {
    method: 'GET',
    headers: {
      'authorization-x': token
    }
  })

  if (!res.ok) throw new Error('Failed to fetch file')
  return await res.json()
}

export async function getDownloadLink(id, token) {
  const res = await fetch(`${API}/download/${id}`, {
    method: 'POST',
    headers: {
      'authorization-x': token
    }
  })

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    console.error('Download error response:', errData)
    throw new Error(errData.message || 'Failed to get download link')
  }

  const data = await res.json()
  return data.download_url
}

export async function downloadFile(link, token, fileName) {
  const res = await fetch(link, {
    method: 'GET',
    headers: { 'authorization-x': token }
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('Download error response:', err)
    throw new Error(err.message || 'Failed to download file')
  }

  const blob = await res.blob()

  const cd = res.headers.get('Content-Disposition')
  if (cd) {
    const match = cd.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/)
    if (match && match[1]) {
      fileName = decodeURIComponent(match[1])
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()

  URL.revokeObjectURL(url)
  a.remove()
}

export async function deleteFile(id, token) {
  const res = await fetch(`${API}/file/${id}`, {
    method: 'DELETE',
    headers: {
      'authorization-x': token
    }
  })

  if (!res.ok) throw new Error('Failed to delete file')
}
