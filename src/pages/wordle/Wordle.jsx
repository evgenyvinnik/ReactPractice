import React, { useState, useEffect } from "react";
import "./styles.css";
import { QUESS_WORDS, LEGAL_GUESSES } from "./words";

const GUESS = {
  INCORRECT: "incorrect",
  SEMICORRECT: "semicorrect",
  CORRECT: "correct",
  NOTHING: "nothing",
};

const MAX_TRIES = 6;
const MAX_LETTERS = 5;

const generateBoard = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array(cols).fill({ letter: "", guess: GUESS.NOTHING })
  );
};

const checkWordle = (solution, guess) => {
  const result = Array(MAX_LETTERS).fill(null);
  const freq = Object.create(null);
  let correctCount = 0;

  // Step 1: mark exact matches and build frequency map
  for (let i = 0; i < MAX_LETTERS; i++) {
    if (guess[i] === solution[i]) {
      result[i] = { letter: guess[i], guess: GUESS.CORRECT };
      correctCount++;
    } else {
      freq[solution[i]] = (freq[solution[i]] || 0) + 1;
    }
  }

  // Step 2: mark semicorrect / incorrect
  for (let i = 0; i < MAX_LETTERS; i++) {
    if (result[i]) continue;

    const letter = guess[i];
    if (freq[letter]) {
      result[i] = { letter, guess: GUESS.SEMICORRECT };
      freq[letter] -= 1;
    } else {
      result[i] = { letter, guess: GUESS.INCORRECT };
    }
  }

  return { result, isWinner: correctCount === MAX_LETTERS };
};

function Letter({ letter }) {
  const getColor = (guess) => {
    switch (guess) {
      case GUESS.INCORRECT:
        return "lightgrey";
      case GUESS.SEMICORRECT:
        return "yellow";
      case GUESS.CORRECT:
        return "lightgreen";
      case GUESS.NOTHING:
        return undefined;
    }
  };

  return (
    <div
      className="letter"
      style={{
        backgroundColor: getColor(letter.guess),
      }}
    >
      {letter.letter}
    </div>
  );
}

function Word({ letters }) {
  return (
    <div className="word">
      {letters.map((letter, index) => (
        <Letter key={`letter-${index}`} letter={letter} />
      ))}
    </div>
  );
}

function Entry({ onGuess, resetRequired, message }) {
  const [entry, setEntry] = useState("");
  const [warning, setWarning] = useState(message);
  const [enabled, setEnabled] = useState(true);
  const onEntryBlur = () => {};

  const onSubmit = (e) => {
    onGuess(entry.toLowerCase());
  };

  const onChange = (e) => {
    const input = e.currentTarget.value;

    setEntry(input);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && entry.length === MAX_LETTERS) {
      onGuess(entry.toLowerCase());
      console.log("Submitted:", entry);
    }
  };

  return (
    <div className="entry">
      <input
        placeholder="▯▯▯▯▯"
        className="guess"
        maxLength={5}
        type="text"
        onKeyDown={onKeyDown}
        onBlur={onEntryBlur}
        onChange={onChange}
        disabled={resetRequired}
      />
      <div className="letterInput">
        {entry.length}/5 letters{" "}
        {entry.length === MAX_LETTERS && "• Press Enter to submit"}
      </div>
      <button
        className="submitButton"
        disabled={!enabled || resetRequired}
        onClick={onSubmit}
      >
        Submit
      </button>
      {warning && <div className="warning">{warning}</div>}
    </div>
  );
}

function Game() {
  const [gameWord, setGameWord] = useState(
    QUESS_WORDS[Math.floor(Math.random() * QUESS_WORDS.length)]
  );
  console.log("gameWord", gameWord);

  const [board, setBoard] = useState(generateBoard(MAX_TRIES, MAX_LETTERS));
  const [attempt, setAttempt] = useState(0);
  const [resetRequired, setResetRequired] = useState(false);
  const [message, setMessage] = useState(null);

  const onGuess = (word) => {
    console.log("word", word);
    const currentAttempt = attempt;
    const check = checkWordle(gameWord, word);

    const newBoard = board.map((r) => r.slice());
    newBoard[currentAttempt] = check.result;
    setBoard(newBoard);
    setAttempt(currentAttempt + 1);
  };

  useEffect(() => {
    if (attempt === MAX_TRIES) {
      setResetRequired(true);
    }
  }, [attempt]);

  return (
    <div>
      <Entry
        onGuess={onGuess}
        resetRequired={resetRequired}
        message={message}
      />
      <div
        className="wordleboard"
        style={{ gridTemplateColumns: `repeat(${MAX_LETTERS}, 1fr)` }}
      >
        {board.map((word, rowIndex) => (
          <Word key={`word-${rowIndex}`} letters={word} />
        ))}
      </div>
    </div>
  );
}

export default function Wordle() {
  const correctExample = [
    { letter: "W", guess: GUESS.CORRECT },
    { letter: "E", guess: GUESS.NOTHING },
    { letter: "A", guess: GUESS.NOTHING },
    { letter: "R", guess: GUESS.NOTHING },
    { letter: "Y", guess: GUESS.NOTHING },
  ];

  const semicorrectExample = [
    { letter: "P", guess: GUESS.NOTHING },
    { letter: "I", guess: GUESS.SEMICORRECT },
    { letter: "L", guess: GUESS.NOTHING },
    { letter: "L", guess: GUESS.NOTHING },
    { letter: "S", guess: GUESS.NOTHING },
  ];
  const incorrectExample = [
    { letter: "V", guess: GUESS.NOTHING },
    { letter: "A", guess: GUESS.NOTHING },
    { letter: "G", guess: GUESS.NOTHING },
    { letter: "U", guess: GUESS.INCORRECT },
    { letter: "E", guess: GUESS.NOTHING },
  ];

  return (
    <main className="container">
      <h1>Wordle</h1>
      <Game />
      <h2>How to play</h2>
      <p className="paragraph">
        Guess the <b>WORDLE</b> in 6 tries.
        <br />
        Each guess must be a valid 5 letter word. Hit the enter button to
        submit.
        <br />
        After each guess, the color of the tiles will change to show how close
        your guess was to the word.
      </p>
      <h3>Examples</h3>
      <div className="examples">
        <Word letters={correctExample} />
        <p className="paragraph">
          The letter W is in the word and in the correct spot.
        </p>
        <br />
        <Word letters={semicorrectExample} />
        <p className="paragraph">
          The letter I is in the word but in the wrong spot.
        </p>
        <br />
        <Word letters={incorrectExample} />
        <p className="paragraph">
          The letter U is not in the word in any spot.
        </p>
      </div>
    </main>
  );
}
