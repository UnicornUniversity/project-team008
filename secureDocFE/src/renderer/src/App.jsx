import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { blue, indigo, grey } from '@mui/material/colors'
import Navbar from './components/Navbar'
import AdminPage from './pages/AdminPage'
import FileListPage from './pages/FileListPage'
import FileDetail from './pages/FileDetail'
import DownLoadPage from './pages/DownLoadPage'
import LoginPage from './pages/LoginPage'
import { Alerts } from './components/Alerts'
import { useStore } from './store/useStore'
import { appStore } from './store/appStore'
import { StoreProvider } from './context/StoreContext'

function App() {
  const user = useStore(appStore, 'user')
  const { pathname } = useLocation()

  const showNavbar = pathname !== '/'

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {user && user.role === 'admin' && <Route path="/admin" element={<AdminPage />} />}

        {user && (
          <>
            <Route path="/files" element={<FileListPage />} />
            <Route path="/files/detail/:id" element={<FileDetail />} />
            <Route path="/files/download" element={<DownLoadPage />} />
          </>
        )}

        {user && user.role === 'user' && (
          <Route path="/admin" element={<Navigate to="/files" replace />} />
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

const theme = createTheme({
  palette: {
    primary: {
      main: blue[700],
      contrastText: '#fff'
    },
    secondary: {
      main: indigo[500]
    },
    background: {
      default: grey[50],
      paper: '#fff'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '3rem', fontWeight: 700 },
    h2: { fontSize: '2.5rem', fontWeight: 600 },
    h3: { fontSize: '2rem', fontWeight: 500 },
    button: { textTransform: 'none' }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16
        }
      }
    }
  }
})

export default function Root() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StoreProvider>
        <HashRouter>
          <App />
          <Alerts />
        </HashRouter>
      </StoreProvider>
    </ThemeProvider>
  )
}
