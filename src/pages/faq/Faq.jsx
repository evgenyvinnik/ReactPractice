import React, { useState } from "react";
import "./styles.css";

function Question({ value }) {
  const { question, answer } = value;
  console.log("question", question);
  console.log("answer", answer);
  const [expanded, setExpanded] = useState(false);

  const onClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="entry" onClick={onClick}>
      <div className="question">
        <div className="question-marker">{expanded ? "▼" : "▶"}</div>
        <div className="question-text">{question}</div>
      </div>
      {expanded ? <div className="answer">{answer}</div> : null}
    </div>
  );
}

function List({ data }) {
  return (
    <div className="list">
      {data.map((value, index) => (
        <Question value={value} key={index} />
      ))}
    </div>
  );
}

export default function Faq() {
  const data = [
    {
      question: "How many bones does a cat have?",
      answer: "A cat has 230 bones - 6 more than a human",
    },
    {
      question: "How much do cats sleep?",
      answer: "The average cat sleeps 12-16 hours per day",
    },
    {
      question: "How long do cats live",
      answer:
        "Outdoor cats live 5 years on average. Indoor\ncats live 15 years on average.",
    },
  ];
  return (
    <main className="container">
      <h1 className="header">Frequently Asked Questions</h1>
      <List data={data} />
    </main>
  );
}
