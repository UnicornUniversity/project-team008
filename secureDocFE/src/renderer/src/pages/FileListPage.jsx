// src/renderer/src/components/FileGrid.js
import React, { useEffect, useState } from 'react'
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Tooltip,
  useTheme,
  Button,
  IconButton
} from '@mui/material'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useFile } from '../hooks/useFile.js'
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.jsx'
import { useNavigate } from 'react-router-dom'

export const MAX_NAME_LENGTH = 20

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export function fileIconByExtension(name) {
  const ext = name.split('.').pop().toLowerCase()
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'].includes(ext))
    return <ImageOutlinedIcon sx={{ fontSize: 48 }} />
  if (ext === 'pdf') return <PictureAsPdfOutlinedIcon sx={{ fontSize: 48 }} />
  if (['xls', 'xlsx', 'csv'].includes(ext)) return <TableChartOutlinedIcon sx={{ fontSize: 48 }} />
  return <InsertDriveFileOutlinedIcon sx={{ fontSize: 48 }} />
}

export default function FileGrid() {
  const theme = useTheme()
  const { listAll, deleteFile } = useFile()
  const [files, setFiles] = useState([])
  const [dlgOpen, setDlgOpen] = useState(false)
  const [target, setTarget] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      const result = await listAll()
      if (result) setFiles(result)
    })()
  }, [])

  const handleDeleteClick = (file) => {
    setTarget(file)
    setDlgOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (target) {
      await deleteFile(target.id)
      setFiles((f) => f.filter((x) => x.id !== target.id))
    }
    setDlgOpen(false)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {files.map((file) => {
          const isSecured = Boolean(file.hardwarePinHash)
          const displayName =
            file.fileName.length > MAX_NAME_LENGTH
              ? `${file.fileName.slice(0, MAX_NAME_LENGTH)}…`
              : file.fileName

          return (
            <Grid key={file.id} item>
              <Card
                variant="outlined"
                sx={{
                  width: 257,
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardActionArea
                  onClick={() => {
                    navigate('/files/detail/' + file.id)
                  }}
                  sx={{
                    flexGrow: 1,
                    px: 2,
                    py: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* File type icon */}
                  {fileIconByExtension(file.fileName)}

                  {/* Filename */}
                  {file.fileName.length > MAX_NAME_LENGTH ? (
                    <Tooltip title={file.fileName}>
                      <Typography
                        variant="subtitle1"
                        noWrap
                        sx={{ width: '100%', textAlign: 'center', mt: 1 }}
                      >
                        {displayName}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      noWrap
                      sx={{ width: '100%', textAlign: 'center', mt: 1 }}
                    >
                      {displayName}
                    </Typography>
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDeleteClick(file)
                    }}
                    sx={{
                      position: 'absolute',
                      top: 20,
                      left: 10,
                      zIndex: 1
                    }}
                  >
                    <Tooltip title="Delete">
                      <DeleteOutlineIcon color="error" fontSize="small" />
                    </Tooltip>
                  </IconButton>
                  {/* Size and lock */}
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 1,
                      position: 'relative' // make this box the positioning context
                    }}
                  >
                    {/* Delete button in top-right corner */}

                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<DownloadOutlinedIcon />}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // placeholder download
                      }}
                    >
                      Download
                    </Button>

                    <Typography variant="caption" color="text.secondary">
                      {formatBytes(file.size)}
                    </Typography>

                    {isSecured ? (
                      <LockOutlinedIcon
                        fontSize="small"
                        sx={{ color: theme.palette.warning.main }}
                      />
                    ) : (
                      <LockOpenOutlinedIcon
                        fontSize="small"
                        sx={{ color: theme.palette.success.main }}
                      />
                    )}
                  </Box>

                  {/* Download button */}
                </CardActionArea>
              </Card>
            </Grid>
          )
        })}

        {/* Upload placeholder */}
        <Grid item>
          <Card
            variant="outlined"
            sx={{
              width: 257,
              height: 200,
              borderStyle: 'dashed',
              color: 'text.secondary',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardActionArea
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2
              }}
              onClick={() => {}}
            >
              <AddCircleOutlineOutlinedIcon sx={{ fontSize: 64 }} />
              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  textAlign: 'center',
                  whiteSpace: 'pre-line'
                }}
              >
                Drag & drop files here{'\n'}or click to upload
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
      <DeleteConfirmDialog
        open={dlgOpen}
        fileName={target?.fileName}
        onClose={() => setDlgOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  )
}
