//PageUser.jsx
import { useStore } from '../context/StoreContext'

const PageUser = () => {
  const { user } = useStore()

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h3>{user} is logged in</h3>
    </div>
  )
}

export default PageUser
