import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="container">
      <ul>
        <li>
          <Link to="/memory_game">Memory Game</Link>
        </li>
        <li>
          <Link to="/undoable_counter">Undoable Counter</Link>
        </li>
        <li>
          <Link to="/faq">Frequenty Asked Questions</Link>
        </li>
        <li>
          <Link to="/timer">Countdown timer</Link>
        </li>
        <li>
          <Link to="/connect_four">Connect Four</Link>
        </li>
        <li>
          <Link to="/wordle">Wordle</Link>
        </li>
      </ul>
    </main>
  );
}
