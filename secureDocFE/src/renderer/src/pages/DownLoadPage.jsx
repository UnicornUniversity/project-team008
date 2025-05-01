import { Box, Typography, Button, CircularProgress, Stack, Snackbar, Alert } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DownLoadPage = () => {
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    // Simulate download time
    setTimeout(() => {
      setDownloading(false)
      setShowSnackbar(true)
    }, 2000)
  }

  const handleBack = () => {
    navigate('/files/detail')
  }

  const handleSnackbarClose = () => {
    setShowSnackbar(false)
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Download Page
      </Typography>

      <Stack spacing={2} mt={4} direction="column" alignItems="center">
        <Button variant="contained" color="primary" onClick={handleDownload} disabled={downloading}>
          {downloading ? <CircularProgress size={24} color="inherit" /> : 'Download'}
        </Button>

        <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleBack}>
          Back to File Detail
        </Button>
      </Stack>

      {/* Snackbar with Alert for green color */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Download completed successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default DownLoadPage
