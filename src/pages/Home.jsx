import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="container">
      <ul>
        <li>
          <Link to="/memory_game">Memory Game</Link>
        </li>
      </ul>
    </main>
  )
}
