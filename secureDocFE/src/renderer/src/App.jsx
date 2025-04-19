// App.jsx
import { HashRouter, Routes, Route } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import Home from './pages/Home'
import PageUser from './pages/PageUser'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<PageUser />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  )
}

export default App
