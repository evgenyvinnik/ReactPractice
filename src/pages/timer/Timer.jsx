import React, { useState, useEffect, useRef } from "react";

import "./styles.css";

const SECOND = 1000;

export default function Timer() {
  const [running, setRunning] = useState(false);

  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const [total, setTotal] = useState(0);

  const [id, setId] = useState(null);

  const calculateTotal = (hour, minute, second) =>
    Number(hour * 3600) + Number(minute * 60) + Number(second);

  useEffect(() => {
    setTotal(calculateTotal(hour, minute, second));
  }, [hour, minute, second]);

  useEffect(() => {
    if (running && total === 0) {
      clearInterval(id);
      setId(null);
      setRunning(false);
      alert("Timer is done!");
    }
  }, [total, running]);

  const onClickStart = () => {
    clearInterval(id);

    setId(
      setInterval(() => {
        setTotal((prev) => prev - 1);
      }, SECOND)
    );

    setRunning(true);
  };

  const onClickPause = () => {
    clearInterval(id);
    setId(null);
  };

  const onClickReset = () => {
    setRunning(false);
    clearInterval(id);
    setId(null);
    setTotal(calculateTotal(hour, minute, second));
  };

  const timeString = (total) => {
    const hour = Math.floor(total / 3600);
    let frac = total - hour * 3600;
    const min = Math.floor(frac / 60);
    const sec = frac - min * 60;

    return `${String(hour).padStart(2, "0")}:${String(min).padStart(
      2,
      "0"
    )}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <main className="container">
      <h1 className="header">Countdown timer</h1>
      <div className="wrapper">
        {running ? (
          <div className="running">{timeString(total)}</div>
        ) : (
          <div className="inputs">
            <input
              className="timeInput"
              type="number"
              value={hour}
              max={60}
              min={0}
              onBlur={() => {
                if (hour < 0) setHour(0);
                else if (hour > 60) setHour(60);
              }}
              onChange={(e) => setHour(e.target.value)}
            />
            <input
              type="number"
              className="timeInput"
              max={60}
              min={0}
              value={minute}
              onBlur={() => {
                if (hour < 0) setMinute(0);
                else if (hour > 60) setMinute(60);
              }}
              onChange={(e) => setMinute(e.target.value)}
            />
            <input
              className="timeInput"
              type="number"
              max={60}
              min={0}
              value={second}
              onBlur={() => {
                if (hour < 0) setSecond(0);
                else if (hour > 60) setSecond(60);
              }}
              onChange={(e) => setSecond(e.target.value)}
            />
          </div>
        )}
        <div className="buttons">
          {id == null ? (
            <button onClick={onClickStart}>Start</button>
          ) : (
            <button onClick={onClickPause}>Pause</button>
          )}
          {running && <button onClick={onClickReset}>Reset</button>}
        </div>
      </div>
    </main>
  );
}
