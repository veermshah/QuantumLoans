import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Borrow from './pages/Borrow'
import Lend from './pages/Lend'
import CryptoHealth from './pages/CryptoHealth'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/borrow" element={<Borrow />} />
        <Route path="/lend" element={<Lend />} />
        <Route path="/cryptohealth" element={<CryptoHealth />} />
      </Routes>
    </Router>
  )
}

export default App
