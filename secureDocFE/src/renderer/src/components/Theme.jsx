//Theme.jsx
import { useStore } from '../context/StoreContext'
const Theme = () => {
  const { theme, setTheme } = useStore()

  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}> Toggle Theme </button>
    </div>
  )
}

export default Theme
