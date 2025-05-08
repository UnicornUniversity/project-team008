import { Box, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { getFileById, getDownloadLink, deleteFile } from '../services/fileService'

const FileDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { token } = useStore()
  const [fileData, setFileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const data = await getFileById(id, token)
        setFileData(data)
      } catch (err) {
        setError('File not found')
      } finally {
        setLoading(false)
      }
    }

    fetchFile()
  }, [id, token])

  const handleBack = () => {
    navigate('/files')
  }

  const handleDownload = async () => {
    try {
      const url = await getDownloadLink(fileData.id, token)
      window.open(url, '_blank')
    } catch (err) {
      alert('Download failed: ' + err.message)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this file?')
    if (!confirmed) return

    try {
      await deleteFile(fileData.id, token)
      navigate('/files')
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Button startIcon={<ArrowBack />} onClick={handleBack} variant="text" sx={{ mb: 2 }}>
        Back to Files
      </Button>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {fileData.fileName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            File ID: {fileData.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Uploaded:{' '}
            {fileData.created_at ? new Date(fileData.created_at).toLocaleString() : 'Unknown'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Uploaded by: {fileData.uploader?.email || 'Unknown'}
          </Typography>
          <Typography
            variant="body2"
            color={fileData.hardwarePinHash ? 'success.main' : 'error.main'}
            sx={{ mt: 1 }}
          >
            Encryption Status: {fileData.hardwarePinHash ? 'Encrypted' : 'Not Encrypted'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleDownload}>
              Download
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default FileDetail
