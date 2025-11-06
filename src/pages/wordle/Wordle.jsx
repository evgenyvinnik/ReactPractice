import React, { useState, useEffect } from "react";
import "./styles.css";
import { GUESS_WORDS, LEGAL_GUESSES } from "./words";

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
    Array(cols)
      .fill(null)
      .map(() => ({ letter: "", guess: GUESS.NOTHING }))
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

function Letter({ letter, animate }) {
  const getColor = (guess) => {
    switch (guess) {
      case GUESS.INCORRECT:
        return "#787c7e";
      case GUESS.SEMICORRECT:
        return "#c9b458";
      case GUESS.CORRECT:
        return "#6aaa64";
      case GUESS.NOTHING:
        return "transparent";
    }
  };

  return (
    <div
      className={`letter ${animate ? "flip" : ""}`}
      style={{
        backgroundColor: getColor(letter.guess),
        borderColor: letter.letter ? "#878a8c" : "#d3d6da",
        color: letter.guess === GUESS.NOTHING ? "#000" : "#fff",
      }}
    >
      {letter.letter}
    </div>
  );
}

function Word({ letters, animate }) {
  return (
    <div className="word">
      {letters.map((letter, index) => (
        <Letter key={`letter-${index}`} letter={letter} animate={animate} />
      ))}
    </div>
  );
}

function Entry({ onGuess, resetRequired, entry, setEntry }) {
  const [warning, setWarning] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const onSubmit = (e) => {
    onGuess(entry);
    setEntry("");
  };

  const onChange = (e) => {
    const input = e.currentTarget.value;

    if (/[^A-Za-z]/.test(input)) {
      setWarning("Only English letters are allowed");
      setTimeout(() => setWarning(""), 2000);
    }

    const filtered = input
      .replace(/[^A-Za-z]/g, "")
      .toLowerCase()
      .slice(0, MAX_LETTERS);
    if (filtered.length === MAX_LETTERS) {
      if (
        !(GUESS_WORDS.includes(filtered) || LEGAL_GUESSES.includes(filtered))
      ) {
        setWarning("This word is not allowed");
        setTimeout(() => setWarning(""), 2000);
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    } else {
      setDisabled(false);
    }
    setEntry(filtered);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && entry.length === MAX_LETTERS && !disabled) {
      onGuess(entry);
      setEntry("");
    }
  };

  return (
    <div className="entry">
      <input
        placeholder="Enter word..."
        className="guess"
        maxLength={5}
        type="text"
        value={entry}
        onKeyDown={onKeyDown}
        onChange={onChange}
        disabled={resetRequired}
        autoFocus
      />
      <div className="letterInput">
        {entry.length}/5 letters{" "}
        {entry.length === MAX_LETTERS && "• Press Enter to submit"}
      </div>
      <button
        className="submitButton"
        disabled={entry.length !== MAX_LETTERS || resetRequired || disabled}
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
    GUESS_WORDS[Math.floor(Math.random() * GUESS_WORDS.length)]
  );

  const [board, setBoard] = useState(generateBoard(MAX_TRIES, MAX_LETTERS));
  const [attempt, setAttempt] = useState(0);
  const [resetRequired, setResetRequired] = useState(false);
  const [message, setMessage] = useState(null);
  const [entry, setEntry] = useState("");
  const [animateRow, setAnimateRow] = useState(-1);

  const onGuess = (word) => {
    const currentAttempt = attempt;
    const check = checkWordle(gameWord.toLowerCase(), word);

    const newBoard = board.map((r) => r.slice());
    newBoard[currentAttempt] = check.result;
    setBoard(newBoard);
    setAnimateRow(currentAttempt);
    setTimeout(() => setAnimateRow(-1), 600);

    setAttempt(currentAttempt + 1);
    if (check.isWinner) {
      setResetRequired(true);
      setMessage("🎉 Congratulations! You won!");
    }
  };

  useEffect(() => {
    if (attempt === MAX_TRIES && !resetRequired) {
      setResetRequired(true);
      setMessage(`😔 Sorry, no more tries. The word was: ${gameWord}`);
    }
  }, [attempt, gameWord, resetRequired]);

  const resetGame = () => {
    setResetRequired(false);
    setBoard(generateBoard(MAX_TRIES, MAX_LETTERS));
    setAttempt(0);
    setMessage(null);
    setEntry("");
    setGameWord(GUESS_WORDS[Math.floor(Math.random() * GUESS_WORDS.length)]);
  };

  return (
    <div>
      <Entry
        onGuess={onGuess}
        resetRequired={resetRequired}
        entry={entry}
        setEntry={setEntry}
      />
      {message && (
        <div className={`message ${resetRequired ? "show" : ""}`}>
          {message}
        </div>
      )}
      <button className="submitButton reset-button" onClick={resetGame}>
        New Game
      </button>
      <div
        className="wordleboard"
        style={{ gridTemplateColumns: `repeat(${MAX_LETTERS}, 1fr)` }}
      >
        {board.map((word, rowIndex) => (
          <Word
            key={`word-${rowIndex}`}
            letters={word}
            animate={rowIndex === animateRow}
          />
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
      <p style={{ textAlign: "left", lineHeight: "1.6", marginBottom: "1rem" }}>
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
        <Word letters={semicorrectExample} />
        <p className="paragraph">
          The letter I is in the word but in the wrong spot.
        </p>
        <Word letters={incorrectExample} />
        <p className="paragraph">
          The letter U is not in the word in any spot.
        </p>
      </div>
    </main>
  );
}
