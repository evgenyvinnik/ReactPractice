import React, { useState, useEffect, use } from "react";
import "./styles.css";

const SIZE = 8;

function Cell({ index, cell, onClick, disabled }) {
  const { isMatched, value, isRevealed } = cell;

  return (
    <button
      className={`cell ${isRevealed ? "revealed" : ""} ${
        isMatched ? "matched" : ""
      }`}
      onClick={() => {
        onClick(index);
      }}
      disabled={disabled || isMatched}
    >
      <div className="cell-inner">
        <div className="cell-front">?</div>
        <div className="cell-back">{value}</div>
      </div>
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

  const onCellClick = (index) => {
    const cell = board[index];

    if (cell.isRevealed || cell.isMatched || isChecking) {
      return;
    }

    const newBoard = [...board];
    newBoard[index].isRevealed = true;
    setBoard(newBoard);

    if (firstSelection === null) {
      setFirstSelection(index);
    } else {
      setIsChecking(true);

      if (newBoard[firstSelection].value === newBoard[index].value) {
        newBoard[firstSelection].isMatched = true;
        newBoard[index].isMatched = true;
        setBoard(newBoard);
        setFirstSelection(null);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setBoard((prev) =>
            prev.map((cell, i) =>
              i === firstSelection || i === index
                ? { ...cell, isRevealed: false }
                : cell
            )
          );
          setFirstSelection(null);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (board.every((cell) => cell.isMatched)) {
      setTimeout(() => {
        alert("Congratulations! You've matched all pairs!");
        setBoard(initializeBoard());
        setFirstSelection(null);
      }, 500);
    }
  }, [board]);

  return (
    <>
      <div className="board">
        {board.map((cell, index) => (
          <Cell
            key={index}
            index={index}
            cell={cell}
            onClick={onCellClick}
            disabled={isChecking}
          />
        ))}
      </div>
      <button
        className="reset-button"
        onClick={() => {
          setBoard(initializeBoard());
          setFirstSelection(null);
          setIsChecking(false);
        }}
      >
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
