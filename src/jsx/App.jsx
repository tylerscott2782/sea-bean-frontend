import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '../css/App.css'
import Login from './Login'
import Register from './Register'

function App() {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  </>
}

export default App
