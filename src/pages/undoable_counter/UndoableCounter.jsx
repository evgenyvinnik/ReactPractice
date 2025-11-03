import React, { useState } from "react";
import "./styles.css";

const STEPS = [1, 10, 100];

export default function UndoableCounter() {
  const [counter, setCounter] = useState(0);

  const [redoStack, setRedoStack] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [history, setHistory] = useState([]);

  const changeCounter = (delta) => {
    const newCounter = counter + delta;

    setHistory([
      { delta, history: `(${counter} -> ${newCounter})` },
      ...history,
    ]);
    setCounter(newCounter);

    setRedoStack([]);
    setUndoStack([-delta, ...undoStack]);
  };

  const onUndo = () => {
    if (undoStack.length === 0) return;

    const [delta, ...restUndo] = undoStack;
    const newCounter = counter + delta;

    setHistory([
      { delta, history: `undo (${counter} -> ${newCounter})` },
      ...history,
    ]);
    setCounter(newCounter);

    setUndoStack(restUndo);
    setRedoStack([-delta, ...redoStack]);
  };

  const onRedo = () => {
    if (redoStack.length === 0) return;

    const [delta, ...restRedo] = redoStack;
    const newCounter = counter + delta;

    setHistory([
      { delta, history: `redo (${counter} -> ${newCounter})` },
      ...history,
    ]);
    setCounter(newCounter);

    setUndoStack([-delta, ...undoStack]);
    setRedoStack(restRedo);
  };

  return (
    <main className="container">
      <h1 className="header">Undoable Counter</h1>
      <div className="undo-redo">
        <button disabled={undoStack.length === 0} onClick={onUndo}>
          Undo
        </button>
        <button disabled={redoStack.length === 0} onClick={onRedo}>
          Redo
        </button>
      </div>
      <div className="counters">
        <div className="stepper">
          {[...STEPS].reverse().map((value, index) => {
            return (
              <button
                key={`down-${index}`}
                onClick={() => {
                  changeCounter(-value);
                }}
              >
                -{value}
              </button>
            );
          })}
        </div>
        <div className="counter">{counter}</div>
        <div className="stepper">
          {[...STEPS].map((value, index) => {
            return (
              <button
                key={`up-${index}`}
                onClick={() => {
                  changeCounter(value);
                }}
              >
                +{value}
              </button>
            );
          })}
        </div>
      </div>
      <h2 className="header">History</h2>
      <div className="history">
        {history.map(({ delta, history }, index) => {
          return (
            <div className="entry" key={`history-${index}`}>
              <div className="delta">{delta}</div>
              <div className="history-entry">{history}</div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
