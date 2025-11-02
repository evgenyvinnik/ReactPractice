import React, { useState, useEffect } from "react";
import "./styles.css";

const SIZE = 36;

function Cell(props) {
  const { index, cell, onClick } = props;
  const {isMatched, value, isRevealed } = cell;

  const onClickButton = () => {
    onClick(index);
  }
  return <button className="cell" onClick={onClickButton}>{
    isRevealed || isMatched ? value.value : "?"
  }</button>;
}

function Board() {
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const initializeBoard = () => {
    const arr = Array(SIZE);
    for (let i = 0; i < SIZE / 2; i++) {
      arr[2 * i] = i + 1;
      arr[2 * i + 1] = i + 1;
    }
    const shuffledArr = shuffleArray(arr);
    const newBoard = shuffledArr.map((value) => ({
      value: value,
      isRevealed: false,
      isMatched: false,
    }));
    return newBoard;
  };

  const [board, setBoard] = useState(initializeBoard());
  const [firstSelection, setFirstSelection] = useState(null);

  const resetBoard = () => {
    setBoard(initializeBoard());
  };

  const onCellClick = (index) => {
    // Handle cell click logic here
    if (board[index].isRevealed || board[index].isMatched) {
      return; // Ignore clicks on revealed or matched cells
    }

    if (firstSelection === null) {
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
  }

  return (
    <>
      <div className="board">
        {board.map((cell, index) => (
          <Cell key={index} cell={cell} onClick={onCellClick} />
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
