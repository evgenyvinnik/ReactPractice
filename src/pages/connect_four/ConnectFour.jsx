import React, { useState } from "react";
import "./styles.css";

const BOARD_WIDTH = 7;
const BOARD_HEIGHT = 6;
const NUM_IN_ROW_WIN = 4;

const CELL = {
  EMPTY: "empty",
  RED: "red",
  YELLOW: "yellow",
  DRAW: "draw",
};

const generateBoard = (rows, cols) => {
  return Array.from({ length: rows }, () => Array(cols).fill(CELL.EMPTY));
};

const checkForWinner = (board) => {
  const checkHorizontalWinner = (board) => {
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      let maxNumInRow = 1;
      let lastToken = board[row][0];
      for (let col = 1; col < BOARD_WIDTH; col++) {
        const currentToken = board[row][col];
        if (currentToken === lastToken && currentToken !== CELL.EMPTY) {
          maxNumInRow++;
          if (maxNumInRow === NUM_IN_ROW_WIN) {
            return currentToken;
          }
        } else {
          maxNumInRow = 1;
        }
        lastToken = currentToken;
      }
    }
    return null;
  };

  const checkVerticalWinner = (board) => {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      let maxNumInRow = 1;
      let lastToken = board[0][col];
      for (let row = 1; row < BOARD_HEIGHT; row++) {
        const currentToken = board[row][col];
        if (currentToken === lastToken && currentToken !== CELL.EMPTY) {
          maxNumInRow++;
          if (maxNumInRow === NUM_IN_ROW_WIN) {
            return currentToken;
          }
        } else {
          maxNumInRow = 1;
        }
        lastToken = currentToken;
      }
    }
    return null;
  };

  const checkDiagonalWinner = (board) => {
    // Check down-right diagonals
    for (let row = 0; row <= BOARD_HEIGHT - NUM_IN_ROW_WIN; row++) {
      for (let col = 0; col <= BOARD_WIDTH - NUM_IN_ROW_WIN; col++) {
        const token = board[row][col];
        if (token !== CELL.EMPTY) {
          let match = true;
          for (let i = 1; i < NUM_IN_ROW_WIN; i++) {
            if (board[row + i][col + i] !== token) {
              match = false;
              break;
            }
          }
          if (match) return token;
        }
      }
    }

    // Check up-right diagonals
    for (let row = NUM_IN_ROW_WIN - 1; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col <= BOARD_WIDTH - NUM_IN_ROW_WIN; col++) {
        const token = board[row][col];
        if (token !== CELL.EMPTY) {
          let match = true;
          for (let i = 1; i < NUM_IN_ROW_WIN; i++) {
            if (board[row - i][col + i] !== token) {
              match = false;
              break;
            }
          }
          if (match) return token;
        }
      }
    }

    return null;
  };

  // Check for draw first
  const hasEmptySpace = board.some((row) => row.includes(CELL.EMPTY));
  if (!hasEmptySpace) {
    return CELL.DRAW;
  }

  return (
    checkHorizontalWinner(board) ||
    checkVerticalWinner(board) ||
    checkDiagonalWinner(board)
  );
};

function Cell({ value }) {
  return (
    <div className="fourCell">
      {value === CELL.EMPTY ? (
        <div />
      ) : value === CELL.RED ? (
        <div className="red" />
      ) : (
        <div className="yellow" />
      )}
    </div>
  );
}

function Board({ rows, cols }) {
  const [board, setBoard] = useState(generateBoard(rows, cols));
  const [dropDisabled, setDropDisabled] = useState(Array(cols).fill(false));
  const [turn, setTurn] = useState(CELL.RED);
  const [winner, setWinner] = useState(CELL.EMPTY);

  const handleDrop = (col) => {
    // Find the lowest empty row
    let row = -1;
    for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
      if (board[r][col] === CELL.EMPTY) {
        row = r;
        break;
      }
    }

    if (row === -1) return; // Column is full (shouldn't happen with disabled buttons)

    // Update board
    const newBoard = board.map((r) => r.slice());
    newBoard[row][col] = turn;
    setBoard(newBoard);

    // Check for winner BEFORE switching turns
    const result = checkForWinner(newBoard);
    if (result != null) {
      setWinner(result);
      setDropDisabled(Array(cols).fill(true));
    } else {
      // Disable column if full
      if (row === 0) {
        const newDisabled = [...dropDisabled];
        newDisabled[col] = true;
        setDropDisabled(newDisabled);
      }
      // Switch turns
      setTurn(turn === CELL.RED ? CELL.YELLOW : CELL.RED);
    }
  };

  const getHeader = () => {
    if (winner === CELL.EMPTY) {
      return turn === CELL.RED ? "RED's turn" : "YELLOW's turn";
    } else if (winner === CELL.RED) {
      return "RED is the winner!";
    } else if (winner === CELL.YELLOW) {
      return "YELLOW is the winner!";
    } else if (winner === CELL.DRAW) {
      return "DRAW!";
    }
  };

  const onReset = () => {
    setBoard(generateBoard(rows, cols));
    setWinner(CELL.EMPTY);
    setTurn(CELL.RED);
    setDropDisabled(Array(cols).fill(false));
  };

  return (
    <div className="board">
      <h2>{getHeader()}</h2>
      {winner !== CELL.EMPTY && (
        <button className="dropButton" onClick={onReset}>
          Reset
        </button>
      )}
      <div
        className="fourField"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {dropDisabled.map((isDisabled, col) => (
          <button
            key={`drop-${col}`}
            className="dropButton"
            disabled={isDisabled}
            onClick={() => {
              handleDrop(col);
            }}
          >
            Drop
          </button>
        ))}
      </div>
      <div
        className="fourField"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell key={`cell-${rowIndex}-${colIndex}`} value={cell} />
          ))
        )}
      </div>
    </div>
  );
}

export default function ConnectFour() {
  return (
    <main className="fourContainer">
      <h1>Connect Four</h1>
      <Board rows={BOARD_HEIGHT} cols={BOARD_WIDTH} />
    </main>
  );
}
