import React, { useState, useEffect, useRef } from "react";

import "./styles.css";

const SECOND = 1000;

export default function Timer() {
  const [running, setRunning] = useState(false);

  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const [total, setTotal] = useState(0);

  const intervalRef = useRef(null);

  const calculateTotal = (hour, minute, second) =>
    Number(hour) * 3600 + Number(minute) * 60 + Number(second);

  useEffect(() => {
    setTotal(calculateTotal(hour, minute, second));
  }, [hour, minute, second]);

  useEffect(() => {
    if (running && total === 0) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setRunning(false);
      alert("Timer is done!");
    }
  }, [total, running]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const onClickStart = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTotal((prev) => prev - 1);
    }, SECOND);

    setRunning(true);
  };

  const onClickPause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const onClickReset = () => {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
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
    <main style={styles.container}>
      <h1 style={styles.header}>Countdown timer</h1>
      <div style={styles.wrapper}>
        {running ? (
          <div style={styles.running}>{timeString(total)}</div>
        ) : (
          <div style={styles.inputs}>
            <input
              style={styles.timeInput}
              type="number"
              value={hour}
              max={23}
              min={0}
              onBlur={() => {
                if (hour < 0) setHour(0);
                else if (hour > 23) setHour(23);
              }}
              onChange={(e) => setHour(Number(e.target.value) || 0)}
            />
            <input
              type="number"
              style={styles.timeInput}
              max={59}
              min={0}
              value={minute}
              onBlur={() => {
                if (minute < 0) setMinute(0);
                else if (minute > 59) setMinute(59);
              }}
              onChange={(e) => setMinute(Number(e.target.value) || 0)}
            />
            <input
              style={styles.timeInput}
              type="number"
              max={59}
              min={0}
              value={second}
              onBlur={() => {
                if (second < 0) setSecond(0);
                else if (second > 59) setSecond(59);
              }}
              onChange={(e) => setSecond(Number(e.target.value) || 0)}
            />
          </div>
        )}
        <div style={styles.buttons}>
          {intervalRef.current == null ? (
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