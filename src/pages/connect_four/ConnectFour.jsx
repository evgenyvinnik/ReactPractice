import React, { useState, useEffect } from "react";
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
  const checkVerticalWinner = (board) => {
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

  const checkHorizontalWinner = (board) => {
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
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        const currentToken = board[row][col];

        if (
          currentToken !== CELL.EMPTY &&
          ((row < board.length - 3 &&
            col < board[row].length - 3 &&
            currentToken === board[row + 1][col + 1] &&
            currentToken === board[row + 2][col + 2] &&
            currentToken === board[row + 3][col + 3]) ||
            (row >= 3 &&
              currentToken === board[row - 1][col + 1] &&
              currentToken === board[row - 2][col + 2] &&
              currentToken === board[row - 3][col + 3]))
        ) {
          return currentToken;
        }
      }
    }

    return null;
  };

  let hasEmptySpace = false;
  board.forEach(
    (row) =>
      (hasEmptySpace =
        hasEmptySpace || row.findIndex((cell) => cell === CELL.EMPTY) >= 0)
  );
  if (!hasEmptySpace) {
    return CELL.DRAW;
  }
  return (
    checkVerticalWinner(board) ||
    checkHorizontalWinner(board) ||
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
    let row = BOARD_HEIGHT - 1;
    for (; row >= 0; row--) {
      if (board[row][col] === CELL.EMPTY) {
        setBoard((prev) => {
          const next = prev.map((row) => row.slice());
          next[row][col] = turn;
          return next;
        });
        break;
      }
    }

    if (row === 0) {
      const newDisabled = [...dropDisabled];
      newDisabled[col] = true;
      setDropDisabled(newDisabled);
    }

    if (turn === CELL.RED) {
      setTurn(CELL.YELLOW);
    } else if (turn === CELL.YELLOW) {
      setTurn(CELL.RED);
    }
  };

  useEffect(() => {
    let potential = checkForWinner(board);
    if (potential != null) {
      setWinner(potential);
      setDropDisabled(Array(cols).fill(true));
    }
  }, [board]);

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
        {dropDisabled.map((dropDisabled, col) => (
          <button
            key={`drop-${col}`}
            className="dropButton"
            disabled={dropDisabled}
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
