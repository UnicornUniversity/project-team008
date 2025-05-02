import { useState } from 'react'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'
import { useStore } from '../context/StoreContext'
import { Button, Typography } from '@mui/material'

const LoginPage = () => {
  const { setUser, setRole, setToken, setUserObject } = useStore()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const handleLogin = (user, role, token, userObject) => {
    console.log(token, userObject)
    setUser(user)
    setRole(role)
    setToken(token)
    setUserObject(userObject)
    setShowLogin(false)
    console.log('handleLogin')
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Typography variant="h2">Welcome to SecureDoc</Typography>
      <div style={{}}>
        <Typography
          variant="h6"
          className="description-card"
          sx={{
            width: '600px',
            margin: 'auto',
            padding: '25px',
            borderRadius: '25px',
            marginTop: '10px',
            marginBottom: '30px',
            boxShadow: '10px 10px 20px 10px gray'
          }}
        >
          <ul>
            <li>Zero-trust, multi-layered security model for cloud-hosted classified assets</li>
            <li>
              Documents ingested and encrypted with SHA-256 using user-specific hardware-derived
              keys
            </li>
            <li>User authentication via hardware token + PIN entered on a secure device</li>
            <li>PIN hashed locally; credentials sent only over encrypted Wi-Fi</li>
            <li>
              Role-based access control enforced through dual-factor validation of hashed PIN and
              hardware token
            </li>
          </ul>
        </Typography>
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button
          size="large"
          variant="contained"
          sx={{ height: '60px', fontSize: '22px', marginRight: '10px' }}
          onClick={() => setShowLogin(true)}
        >
          Login
        </Button>
        <Button
          size="large"
          variant="contained"
          sx={{ height: '60px', fontSize: '22px' }}
          onClick={() => setShowRegister(true)}
        >
          Register
        </Button>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} onLogin={handleLogin} />
      )}
    </div>
  )
}

export default LoginPage
