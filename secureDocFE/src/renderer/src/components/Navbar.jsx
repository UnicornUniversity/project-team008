// src/renderer/src/components/Navbar.js
import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import md5 from 'blueimp-md5'
import smallLogo from '../assets/small_logo.png'
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'

import { useStore } from '../store/useStore.js'
import { appStore } from '../store/appStore.js'

export default function Navbar() {
  const user = useStore(appStore, 'user')
  const role = useStore(appStore, 'role')
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleLogout = () => {
    handleMenuClose()
    appStore.setState({
      user: undefined,
      role: undefined,
      token: undefined,
      userObject: undefined
    })
    navigate('/')
  }

  if (!user) return null

  const emailHash = md5(user.email.trim().toLowerCase())
  const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=wavatar&s=100`

  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{ borderBottom: '4px solid rgba(201, 201, 201, 0.3)' }}
      variant="flat"
      elevation={1}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Avatar alt="SecureDoc" src={smallLogo} />
          </Box>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {role === 'admin' && (
                <Button
                  component={NavLink}
                  to="/admin"
                  color="inherit"
                  sx={{
                    '&.active': { fontWeight: 600, textDecoration: 'underline' }
                  }}
                >
                  Admin
                </Button>
              )}

              <Button
                color="inherit"
                onClick={handleMenuOpen}
                sx={{
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography variant="body2">{user.email}</Typography>
                <Avatar alt={user.email} src={gravatarUrl} />
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem
                  onClick={() => {
                    navigate('/files')
                    handleMenuClose()
                  }}
                >
                  <FolderOpenOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                  Files
                </MenuItem>

                {role === 'admin' && (
                  <MenuItem
                    onClick={() => {
                      navigate('/admin')
                      handleMenuClose()
                    }}
                  >
                    Admin
                  </MenuItem>
                )}

                <MenuItem onClick={handleLogout}>
                  <LogoutOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
