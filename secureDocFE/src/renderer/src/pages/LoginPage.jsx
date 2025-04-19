//LoginPage.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const LoginPage = () => {
  const { user, role } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && role !== 'admin') {
      navigate('/files')
    }
  }, [user, role, navigate])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h3>{user} is logged in</h3>
    </div>
  )
}

export default LoginPage
