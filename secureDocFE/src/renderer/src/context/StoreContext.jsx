// StoreContext.jsx
import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const StoreContext = createContext()

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [theme, setTheme] = useState('light')

  return (
    <StoreContext.Provider value={{ user, setUser, role, setRole, theme, setTheme }}>
      {children}
    </StoreContext.Provider>
  )
}

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired
}
// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  return useContext(StoreContext)
}
