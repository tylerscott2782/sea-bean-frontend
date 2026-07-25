import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '../css/App.css'
import Login from './Login'

function App() {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </>
}

export default App
