// src/renderer/src/components/Navbar.js
import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import md5 from 'blueimp-md5'
import smallLogo from '../assets/small_logo.png'

import { useStore } from '../store/useStore.js'
import { appStore } from '../store/appStore.js'

export default function Navbar() {
  const user = useStore(appStore, 'user')
  const role = useStore(appStore, 'role')
  const navigate = useNavigate()

  const handleLogout = () => {
    appStore.setState({
      user: undefined,
      role: undefined,
      token: undefined,
      userObject: undefined
    })
    navigate('/')
  }

  const emailHash = md5(user.email.trim().toLowerCase())
  const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=wavatar&s=100`

  console.log('user', user)

  if (!user) return ''

  return (
    <AppBar position="static" color="inherit" variant="flat" elevation={1}>
      <Toolbar>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Avatar alt={'SecureDoc'} src={smallLogo} />
          </Box>

          {user ? (
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
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="inherit">
                  {user?.email}
                </Typography>
                <Avatar alt={user.email} src={gravatarUrl} />
              </Box>

              {/* Logout */}
            </Box>
          ) : (
            <Button color="inherit" onClick={() => navigate('/')}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
