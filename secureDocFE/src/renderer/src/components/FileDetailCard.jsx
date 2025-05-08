// src/renderer/src/components/FileDetailCard.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
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
  Divider,
  useTheme,
  Tooltip,
  IconButton
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'

import { useStore } from '../store/useStore.js'
import { appStore } from '../store/appStore.js'
import { useFile } from '../hooks/useFile.js'
import { useFileAccess } from '../hooks/useFileAccess.js'
import { useUser } from '../hooks/useUser.js'
import { fileIconByExtension } from '../pages/FileListPage.jsx'
import {
  DeleteForeverOutlined,
  DeleteSweep,
  DeleteSweepOutlined,
  DeleteSweepRounded,
  DownloadOutlined
} from '@mui/icons-material'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

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

  const userObj = useStore(appStore, 'userObject')
  const isOwner = Boolean(userObj?.id && Number(userObj.id) === Number(fileId))

  const { getById, updateFile } = useFile()
  const { listForFile, grantAccess } = useFileAccess()
  const { fetchAll: fetchUsers } = useUser()

  const [file, setFile] = useState(null)
  const [accessList, setAccessList] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  const owner = useMemo(() => {
    let ownerUser = allUsers.find((usr) => usr.id === file.owner)
    if (!ownerUser) ownerUser = {}
    ownerUser.hash = md5(ownerUser?.email?.trim()?.toLowerCase())

    return ownerUser
  }, [file, allUsers])

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
                        // call your update-permission handler:
                        handlePermissionToggle(entry.id, newPerm)
                      }
                    }}
                  >
                    <ToggleButton value="read">Read</ToggleButton>
                    <ToggleButton value="write">Write</ToggleButton>
                  </ToggleButtonGroup>
                  <Button color="error" sx={{ ml: 1, height: 26 }}>
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

  const handleLock = async () => {
    // TODO: show PIN prompt modal, then call your Pin‐setting API
    // stub:
    const pin = prompt(
      isLocked ? 'Enter new hardware PIN to change lock:' : 'Enter hardware PIN to lock this file:'
    )
    if (!pin) return
    // call your backend, e.g.:
    // await yourHook.setHardwarePin(fileId, pin)
    alert('🔒 PIN set (stub): ' + pin)
  }

  const handleGrant = async () => {
    if (!selectedUser) return
    await grantAccess(fileId, selectedUser.id, 'read')
    const newList = await listForFile(fileId)
    setAccessList(newList || [])
    setSelectedUser(null)
  }

  const toGrant = allUsers.filter((u) => !accessList.some((a) => a.userId === u.id))
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
              <Button startIcon={<DownloadOutlined />} color={'primary'} variant="outlined">
                DOWNLOAD
              </Button>

              <Button startIcon={<LockOutlinedIcon />} color={'warning'} variant="outlined">
                {isLocked ? 'CHANGE LOCK' : 'HARDWARE LOCK'}
              </Button>

              <Button variant={'outlined'} color={'error'}>
                <DeleteSweepOutlined />
              </Button>
            </Box>
          </Box>

          {isOwner && (
            <Button
              variant="contained"
              color={isLocked ? 'secondary' : 'primary'}
              onClick={handleLock}
            >
              {isLocked ? 'Change Lock' : 'Hardware Lock'}
            </Button>
          )}
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
                  <Avatar src={`https://www.gravatar.com/avatar/${hash}?d=wavatar&s=32`} />
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
    </Box>
  )
}
