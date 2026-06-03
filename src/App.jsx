import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Quiniela from './pages/Quiniela'
import Admin from './pages/Admin'
import Tabla from './pages/Tabla'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jugador/:token" element={<Quiniela />} />
        <Route path="/tabla" element={<Tabla />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
