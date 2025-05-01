import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material'
import { Download as DownloadIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const files = [
  { id: 1, name: 'SecureDoc1.pdf', uploadDate: '2025-04-26', encrypted: true },
  { id: 2, name: 'Report2025.pdf', uploadDate: '2025-04-20', encrypted: false },
  { id: 3, name: 'IoT_Project.docx', uploadDate: '2025-04-15', encrypted: true }
]

const FileListPage = () => {
  const navigate = useNavigate()

  const handleFileClick = (fileId) => {
    navigate(`/files/detail/${fileId}`)
  }

  const handleDownloadClick = (fileId) => {
    // Simulate download click
    alert(`Downloading file ID: ${fileId}`)
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Available Files
      </Typography>

      <Stack spacing={2} mt={4}>
        {files.map((file) => (
          <Card key={file.id}>
            <CardContent
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Box sx={{ cursor: 'pointer' }} onClick={() => handleFileClick(file.id)}>
                <Typography variant="h6">{file.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Uploaded: {file.uploadDate}
                </Typography>
                <Typography variant="body2" color={file.encrypted ? 'success.main' : 'error.main'}>
                  {file.encrypted ? 'Encrypted' : 'Not Encrypted'}
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
      </Stack>
    </Box>
  )
}

export default FileListPage
