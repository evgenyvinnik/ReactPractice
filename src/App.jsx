import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MemoryGame from './pages/memory_game/MemoryGame'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/memory_game" element={<MemoryGame />} />
    </Routes>
  )
}
