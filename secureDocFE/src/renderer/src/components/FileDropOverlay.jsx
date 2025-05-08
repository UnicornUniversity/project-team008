import React from 'react'
import { Box, Paper, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import { useFileDrop } from '../hooks/useFileDrop'

export default function FileDropOverlay({ onFiles }) {
  const theme = useTheme()
  const isDragging = useFileDrop(onFiles)

  if (!isDragging) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: alpha(theme.palette.primary.main, 0.9),
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: theme.palette.background.paper
        }}
      >
        <UploadFileOutlinedIcon sx={{ fontSize: 80, color: theme.palette.primary.main }} />
        <Typography variant="h4" sx={{ mt: 2 }}>
          Drop files to upload
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Or keep dragging to cancel
        </Typography>
      </Paper>
    </Box>
  )
}
