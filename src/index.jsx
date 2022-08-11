import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/style.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Profile from './pages/profile'
import Error from './pages/Error'
import Header from './components/Header'
import Footer from './components/Footer'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Error />} />
    </Routes>
    <Footer />
  </Router>
)
