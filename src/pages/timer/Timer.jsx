import React, { useState, useEffect } from "react";

import "./styles.css";

const SECOND = 1000;

export default function Timer() {
  const [running, setRunning] = useState(false);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [total, setTotal] = useState(0);
  const [id, setId] = useState(null);

  const [reset, setReset] = useState({ hour: 0, minute: 0, second: 0 });

  const calculateTotal = (hour, minute, second) =>
    Number(hour * 3600) + Number(minute * 60) + Number(second);

  useEffect(() => {
    if (running) {
      setId(
        setInterval(() => {
          setTotal((prev) => prev - 1);
        }, SECOND)
      );
    } else {
      clearInterval(id);
      setId(null);
    }
  }, [running]);

  useEffect(() => {
    if (running && total === 0) {
      clearInterval(id);
      setId(null);
      setRunning(false);
      alert("Timer is done!");
    }
  }, [total, running]);

  const onClickStart = () => {
    const counts = calculateTotal(hour, minute, second);
    console.log("calculateTotal", counts);
    setTotal(counts);
    setRunning(true);
    setReset({
      hour,
      minute,
      second,
    });
  };

  const onClickPause = () => {
    setRunning(false);
  };
  const onClickReset = () => {
    setHour(reset.hour);
    setMinute(reset.minute);
    setSecond(reset.second);

    setTotal(calculateTotal(reset.hour, reset.minute, reset.second))
  };

  return (
    <main className="container">
      <h1 className="header">Countdown timer</h1>
      <div className="wrapper">
        {running ? (
          <div className="running">
            {total}
            {/* {hour} : {minute} : {second} */}
          </div>
        ) : (
          <div className="inputs">
            <input
              className="timeInput"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            />
            <input
              className="timeInput"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
            />
            <input
              className="timeInput"
              value={second}
              onChange={(e) => setSecond(e.target.value)}
            />
          </div>
        )}
        <div className="buttons">
          {running ? (
            <>
              <button onClick={onClickPause}>Pause</button>
              <button onClick={onClickReset}>Reset</button>
            </>
          ) : (
            <button onClick={onClickStart}>Start</button>
          )}
        </div>
      </div>
    </main>
  );
}
