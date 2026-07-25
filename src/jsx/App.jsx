import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '../css/App.css'
import Login from './Login'
import Register from './Register'
import Home from './Home'

function App() {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </>
}

export default App
