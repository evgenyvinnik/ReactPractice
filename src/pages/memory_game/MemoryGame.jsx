import React, { useState, useEffect, use } from "react";
import "./styles.css";

const SIZE = 8;

function Cell({ index, cell, onClick, disabled }) {
  const { isMatched, value, isRevealed } = cell;

  return (
    <button
      className="cell"
      onClick={() => {
        onClick(index);
      }}
      disabled={disabled || isMatched}
    >
      {isRevealed || isMatched ? value : "?"}
    </button>
  );
}

function Board() {

  const initializeBoard = () => {
    const pairs = Array.from({ length: SIZE / 2 }, (_, i) => i + 1);
     const shuffled = [...pairs, ...pairs].sort(() => Math.random() - 0.5);

    return shuffled.map((value) => ({
      value: value,
      isRevealed: false,
      isMatched: false,
    }));
  };

  const [board, setBoard] = useState(initializeBoard());
  const [firstSelection, setFirstSelection] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const resetBoard = () => {
    setBoard(initializeBoard());
  };

  const revealCell = (index) => {
    const newBoard = board.slice();
    newBoard[index].isRevealed = true;
    setBoard(newBoard);
  };

  const onCellClick = (index) => {
    // Handle cell click logic here
    if (board[index].isRevealed || board[index].isMatched) {
      return; // Ignore clicks on revealed or matched cells
    }

    if (firstSelection == null) {
      // First cell selected
      revealCell(index);
      setFirstSelection(index);
    } else {
      // Second cell selected
      revealCell(index);
      if (board[firstSelection].value === board[index].value) {
        // It's a match
        const newBoard = board.slice();
        newBoard[firstSelection].isMatched = true;
        newBoard[index].isMatched = true;
        setBoard(newBoard);
      } else {
        // Not a match, hide cells after a delay
        setTimeout(() => {
          const newBoard = board.slice();
          newBoard[firstSelection].isRevealed = false;
          newBoard[index].isRevealed = false;
          setBoard(newBoard);
        }, 1000);
      }
      setFirstSelection(null);
    }
  };

  useEffect(() => {
    // Check for game completion
    if (board.every((cell) => cell.isMatched)) {
      setTimeout(() => {
        alert("Congratulations! You've matched all pairs!");
        resetBoard();
      }, 500);
    }
  }, [board]);

  return (
    <>
      <div className="board">
        {board.map((cell, index) => (
          <Cell key={index} index={index} cell={cell} onClick={onCellClick} />
        ))}
      </div>
      <button className="reset-button" onClick={resetBoard}>
        Reset Game
      </button>
    </>
  );
}

export default function MemoryGame() {
  return (
    <main className="container">
      <h1 className="header">Memory Game</h1>
      <Board />
    </main>
  );
}
