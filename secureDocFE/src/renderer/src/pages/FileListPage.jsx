import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material'
import { Download as DownloadIcon, CloudUpload } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { uploadFile, getAllFiles } from '../services/fileService'

const FileListPage = () => {
  const navigate = useNavigate()
  const { token } = useStore()
  const [files, setFiles] = useState([])
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const fetchFiles = async () => {
    try {
      const res = await getAllFiles(token)
      setFiles(res)
    } catch (err) {
      console.error('Failed to fetch files', err)
    }
  }

  useEffect(() => {
    fetchFiles()
    console.log('Fetching files...')
  }, [])

  const handleFileClick = (fileId) => {
    navigate(`/files/detail/${fileId}`)
  }

  const handleDownloadClick = (fileId) => {
    alert(`Downloading file ID: ${fileId}`)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return

    try {
      await uploadFile(file, token)
      setUploadSuccess(true)
      await fetchFiles() // reload files after upload ✅
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  const handleDragOver = (e) => e.preventDefault()

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Available Files
      </Typography>

      <Stack spacing={3} mt={4}>
        {files.map((file) => (
          <Card key={file.id} sx={{ boxShadow: 3 }}>
            <CardContent
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Box sx={{ cursor: 'pointer' }} onClick={() => handleFileClick(file.id)}>
                <Typography variant="h6">{file.fileName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Uploaded:{' '}
                  {file.created_at ? new Date(file.created_at).toLocaleString() : 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Uploaded by: {file.uploader?.email || 'Unknown'}
                </Typography>
                <Typography
                  variant="body2"
                  color={file.hardwarePinHash ? 'success.main' : 'error.main'}
                >
                  {file.hardwarePinHash ? 'Encrypted' : 'Not Encrypted'}
                </Typography>
              </Box>

              <Tooltip title="Download">
                <IconButton onClick={() => handleDownloadClick(file.id)}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </CardContent>
          </Card>
        ))}

        <Card
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            border: '2px dashed gray',
            textAlign: 'center',
            py: 5,
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
            boxShadow: 2,
            borderRadius: 2
          }}
        >
          <CardContent>
            <CloudUpload sx={{ fontSize: 50, color: 'gray' }} />
            <Typography variant="body1">Drag & Drop a File Here to Upload</Typography>
          </CardContent>
        </Card>
      </Stack>

      <Snackbar
        open={uploadSuccess}
        autoHideDuration={3000}
        onClose={() => setUploadSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setUploadSuccess(false)}>
          File uploaded successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default FileListPage
