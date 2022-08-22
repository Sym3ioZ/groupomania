import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/style.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Profile from './pages/profile'
import ModifyPost from './pages/ModifyPost'
import ModifyProfile from './pages/ModifyProfile'
import Error from './pages/Error'
import Unauthorized from './pages/Unauthorized'
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
      <Route path="/modifyPost" element={<ModifyPost />} />
      <Route path="/modifyProfile" element={<ModifyProfile />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Error />} />
    </Routes>
    <Footer />
  </Router>
)
