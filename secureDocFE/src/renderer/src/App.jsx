import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StoreProvider, useStore } from './context/StoreContext'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import FileListPage from './pages/FileListPage'
import FileDetail from './pages/FileDetail'
import DownLoadPage from './pages/DownLoadPage'

const AppRoutes = () => {
  const { user, role } = useStore()

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} /> {/* Login Page */}
      {user && (
        <>
          <Route path="/files" element={<FileListPage />} />
          <Route path="/files/detail" element={<FileDetail />} />
          <Route path="/files/download" element={<DownLoadPage />} />
        </>
      )}
      {user && role === 'user' && (
        <Route path="/admin" element={<Navigate to="/files" replace />} />{/* Eventually some admin page to handle reset Arduinos. */}
      )}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

const App = () => (
  <StoreProvider>
    <HashRouter>
      <Navbar />
      <AppRoutes />
    </HashRouter>
  </StoreProvider>
)

export default App
