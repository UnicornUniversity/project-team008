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
    <div  style={{ padding: '2rem', textAlign: 'center' }}>
      <Typography variant="h2">Welcome to SecureDoc</Typography>
      <div style={{ }}>
        <Typography variant="h6" className='description-card' sx={{ width: '600px', margin: 'auto', padding: '25px',  borderRadius: '25px', marginTop: '10px', marginBottom: '30px', boxShadow: '10px 10px 20px 10px gray' }}>
          The system employs a zero-trust, multi-layered security model for managing classified
          digital assets in the cloud. Documents are securely ingested and encrypted using SHA-256
          with user-specific hardware-derived keys. <br />
          Users are authenticated via a hardware token and a PIN, entered through a secure device,
          hashed locally, and transmitted over encrypted Wi-Fi. Role-based access control (RBAC)
          governs document access, enforced through dual-factor validation of the hashed PIN and
          hardware token.
          <br />A secure recovery process handles lost hardware via OTP verification and admin
          approval, with all actions immutably logged. Admins manage credentials, review security
          events, and audit logs.
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
