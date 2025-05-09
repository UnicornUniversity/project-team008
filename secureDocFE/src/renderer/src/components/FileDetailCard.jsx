// src/renderer/src/components/FileDetailCard.jsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import md5 from 'blueimp-md5'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Autocomplete,
  TextField,
  useTheme,
  Tooltip
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'

import { useStore } from '../store/useStore.js'
import { appStore } from '../store/appStore.js'
import { useFile } from '../hooks/useFile.js'
import { useFileAccess } from '../hooks/useFileAccess.js'
import { useUser } from '../hooks/useUser.js'
import { fileIconByExtension } from '../pages/FileListPage.jsx'
import { DeleteSweepOutlined, DownloadOutlined } from '@mui/icons-material'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useLockOverlay } from '../hooks/useLockOverlay.js'
import LockOverlay from './LockOverlay.jsx'
import DeleteConfirmDialog from './DeleteConfirmDialog.jsx'
import { useDownload } from '../hooks/useDownload.js'

const MAX_NAME_LENGTH = 24

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export default function FileDetailCard() {
  const { id } = useParams()
  const fileId = id
  const theme = useTheme()

  const user = useStore(appStore, 'user')

  const { getById, deleteFile, lockToArduino } = useFile()
  const { listForFile, grantAccess, revokeAccess, updateAccess } = useFileAccess()
  const { fetchAll: fetchUsers } = useUser()
  const { download } = useDownload()

  const [file, setFile] = useState(null)
  const [accessList, setAccessList] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const navigate = useNavigate()

  const lock = useLockOverlay()

  const [dlgOpen, setDlgOpen] = useState(false)

  const handleDeleteClick = () => {
    setDlgOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (file) {
      await deleteFile(file.id)
      navigate('/files')
    }
    setDlgOpen(false)
  }

  const handleHardwareLock = () => {
    console.log('clicked')
    lock.startLock()
  }

  const handleLockFile = async ({ arduinoId, pin }) => {
    console.log('{ arduinoId, pin }', { arduinoId, pin })
    if (isDownloading) {
      await download(file, pin, arduinoId)
    } else {
      await lockToArduino({ fileId, arduinoId, pinHash: pin })
      const f = await getById(fileId)
      setFile(f)
    }
  }

  const owner = useMemo(() => {
    let ownerUser = allUsers.find((usr) => usr.id === file?.owner)
    if (!ownerUser) ownerUser = {}
    ownerUser.hash = md5(ownerUser?.email?.trim()?.toLowerCase())

    return ownerUser
  }, [file, allUsers])

  const isOwner = user.id === owner.id

  const handleDownloadFile = async () => {
    if (isLocked) {
      lock.startLock()
      setIsDownloading(true)
    } else {
      await download(file)
    }
  }

  const accessListOptions = useMemo(
    () =>
      accessList.map((entry) => {
        const accessedUser = allUsers.find((usr) => usr.id === entry.userId)
        const hash = md5(accessedUser?.email?.trim()?.toLowerCase())
        return (
          <ListItem
            key={entry.id}
            sx={{ alignItems: 'flex-start', borderBottom: '1px solid ' + theme.palette.grey[200] }}
          >
            <ListItemAvatar>
              <Avatar
                imgProps={{ draggable: false }}
                sx={{ mt: 1, width: 50, height: 50 }}
                src={`https://www.gravatar.com/avatar/${hash}?d=wavatar&s=100`}
              />
            </ListItemAvatar>

            <ListItemText
              sx={{ ml: 2 }}
              primary={accessedUser?.email}
              secondary={
                <>
                  <ToggleButtonGroup
                    variant="outlined"
                    color="success"
                    sx={{ height: 26 }}
                    size="small"
                    value={entry.permission}
                    exclusive
                    onChange={(_, newPerm) => {
                      if (newPerm) {
                        handlePermissionToggle(entry.id, newPerm)
                      }
                    }}
                  >
                    <ToggleButton
                      onClick={async () => {
                        await updateAccess({
                          userId: entry.userId,
                          fileId: entry.fileId,
                          permission: 'read'
                        })
                        const newList = await listForFile(fileId)
                        setAccessList(newList || [])
                      }}
                      value="read"
                    >
                      Read
                    </ToggleButton>
                    <ToggleButton
                      onClick={async () => {
                        await updateAccess({
                          userId: entry.userId,
                          fileId: entry.fileId,
                          permission: 'write'
                        })

                        const newList = await listForFile(fileId)
                        setAccessList(newList || [])
                      }}
                      value="write"
                    >
                      Write
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Button
                    onClick={async () => {
                      await revokeAccess({
                        userId: entry.userId,
                        fileId: entry.fileId
                      })
                      const newList = await listForFile(fileId)
                      setAccessList(newList || [])
                    }}
                    color="error"
                    sx={{ ml: 1, height: 26 }}
                  >
                    Remove
                  </Button>
                </>
              }
            />
          </ListItem>
        )
      }),
    [accessList, allUsers]
  )

  useEffect(() => {
    ;(async () => {
      const f = await getById(fileId)
      setFile(f)
    })()
  }, [fileId])

  useEffect(() => {
    ;(async () => {
      const list = await listForFile(fileId)
      setAccessList(list || [])
    })()
  }, [fileId])

  useEffect(() => {
    ;(async () => {
      const u = await fetchUsers()
      setAllUsers(u || [])
    })()
  }, [])

  if (!file) return null

  const isLocked = Boolean(file.hardwarePinHash)

  const handleGrant = async () => {
    if (!selectedUser) return
    await grantAccess(fileId, selectedUser.id, 'read')
    const newList = await listForFile(fileId)
    setAccessList(newList || [])
    setSelectedUser(null)
  }

  const toGrant = allUsers.filter(
    (u) => u.id !== file.owner && !accessList.some((a) => a.userId === u.id)
  )
  const displayName =
    file.fileName.length > MAX_NAME_LENGTH
      ? `${file.fileName.slice(0, MAX_NAME_LENGTH)}…`
      : file.fileName

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 70px)',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <Card sx={{ flex: '0 0 auto', mb: 3 }} variant="outlined">
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Avatar
            variant="rounded"
            imgProps={{ draggable: false }}
            sx={{
              width: 80,
              height: 80,
              bgcolor: (theme) => theme.palette.primary.main
            }}
          >
            {fileIconByExtension(file.fileName)}
          </Avatar>

          {file.fileName.length > MAX_NAME_LENGTH ? (
            <Tooltip title={file.fileName}>
              <Typography sx={{ flexGrow: 1 }} variant="h6" noWrap>
                {displayName}
              </Typography>
            </Tooltip>
          ) : (
            <Typography sx={{ flexGrow: 1 }} variant="h6" noWrap>
              {displayName}
            </Typography>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography color="text.secondary">{formatBytes(file.size)}</Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isLocked ? (
                  <LockOutlinedIcon color="warning" />
                ) : (
                  <LockOpenOutlinedIcon color="success" />
                )}
                <Typography>{isLocked ? 'Locked' : 'Unlocked'}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={handleDownloadFile}
                startIcon={<DownloadOutlined />}
                color={'primary'}
                variant="outlined"
              >
                DOWNLOAD
              </Button>

              {isOwner && (
                <Button
                  startIcon={<LockOutlinedIcon />}
                  onClick={handleHardwareLock}
                  color={'warning'}
                  variant="outlined"
                >
                  {isLocked ? 'CHANGE LOCK' : 'HARDWARE LOCK'}
                </Button>
              )}

              <Button onClick={handleDeleteClick} variant={'outlined'} color={'error'}>
                <DeleteSweepOutlined />
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <CardContent
          sx={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            p: 2
          }}
        >
          <Typography variant="h6" gutterBottom>
            Access Control
          </Typography>

          <Box
            sx={{
              flex: '1 1 auto',
              overflowY: 'auto'
            }}
          >
            {owner && (
              <ListItem
                key={owner.id}
                sx={{
                  alignItems: 'flex-start',
                  borderBottom: '1px solid ' + theme.palette.grey[200]
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    imgProps={{ draggable: false }}
                    sx={{ mt: 1, width: 50, height: 50 }}
                    src={`https://www.gravatar.com/avatar/${owner?.hash}?d=wavatar&s=100`}
                  />
                </ListItemAvatar>

                <ListItemText sx={{ ml: 2 }} primary={owner?.email} secondary={'Owner'} />
              </ListItem>
            )}
            {accessListOptions}
          </Box>

          <Autocomplete
            options={toGrant}
            getOptionLabel={(u) => u.email}
            value={selectedUser}
            onChange={(_, v) => setSelectedUser(v)}
            renderOption={(props, option) => {
              const hash = md5(option.email.trim().toLowerCase())
              return (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Avatar
                    draggable={false}
                    src={`https://www.gravatar.com/avatar/${hash}?d=wavatar&s=32`}
                  />
                  {option.email}
                </Box>
              )
            }}
            renderInput={(params) => <TextField {...params} label="Add user…" fullWidth />}
            sx={{ mb: 2 }}
          />

          <Box sx={{ textAlign: 'right' }}>
            <Button variant="outlined" disabled={!selectedUser} onClick={handleGrant}>
              Grant Access
            </Button>
          </Box>
        </CardContent>
      </Card>
      <LockOverlay {...lock} handlePin={handleLockFile} />
      <DeleteConfirmDialog
        open={dlgOpen}
        fileName={file?.fileName}
        onClose={() => setDlgOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  )
}
