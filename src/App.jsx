import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MemoryGame from "./pages/memory_game/MemoryGame";
import UndoableCounter from "./pages/undoable_counter/UndoableCounter";
import Faq from "./pages/faq/Faq";
import Timer from "./pages/timer/Timer";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/memory_game" element={<MemoryGame />} />
      <Route path="/undoable_counter" element={<UndoableCounter />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/timer" element={<Timer />} />
    </Routes>
  );
}
