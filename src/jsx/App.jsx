import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import '../css/App.css'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Profile from './Profile'
import NavBar from './NavBar'

function App() {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<NavBar />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

      </Routes>
    </BrowserRouter >
  </>
}

export default App
