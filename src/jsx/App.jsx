import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import '../css/App.css'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Profile from './Profile'
import NavBar from './NavBar'

function App() {
  return <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&family=Playpen+Sans:wght@100..800&display=swap" rel="stylesheet"></link>
    
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
