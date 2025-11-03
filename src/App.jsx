import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MemoryGame from "./pages/memory_game/MemoryGame";
import UndoableCounter from "./pages/undoable_counter/UndoableCounter";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/memory_game" element={<MemoryGame />} />
      <Route path="/undoable_counter" element={<UndoableCounter />} />
    </Routes>
  );
}
