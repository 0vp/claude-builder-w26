import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/match/:name/:interest" element={<ProfilePage />} />
    </Routes>
  )
}

export default App
