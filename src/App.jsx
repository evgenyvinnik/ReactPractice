import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MemoryGame from "./pages/memory_game/MemoryGame";
import UndoableCounter from "./pages/undoable_counter/UndoableCounter";
import Faq from "./pages/faq/Faq";
import Timer from "./pages/timer/Timer";
import ConnectFour from "./pages/connect_four/ConnectFour";
import Wordle from "./pages/wordle/Wordle";
import Test from "./pages/phone_input/PhoneInput";
import Tooltip from "./pages/tooltip/Tooltip";
import TableSelect from "./pages/table_select/TableSelect";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/memory_game" element={<MemoryGame />} />
      <Route path="/undoable_counter" element={<UndoableCounter />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/timer" element={<Timer />} />
      <Route path="/connect_four" element={<ConnectFour />} />
      <Route path="/wordle" element={<Wordle />} />
      <Route path="/phone_input" element={<Test />} />
      <Route path="/tooltip" element={<Tooltip />} />
      <Route path="/table_select" element={<TableSelect />} />
    </Routes>
  );
}
