import React, { useState } from "react";
import "./styles.css";

function Question({ value }) {
  const { question, answer } = value;
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="entry" onClick={toggle}>
      <div className="question">
        <span className="question-marker">{expanded ? "▼" : "▶"}</span>
        <span className="question-text">{question}</span>
      </div>
      {expanded && <div className="answer">{answer}</div>}
    </div>
  );
}

function List({ data }) {
  return (
    <div className="list">
      {data.map((value) => (
        <Question value={value} key={value.question} />
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
      question: "How long do cats live?",
      answer:
        "Outdoor cats live 5 years on average. Indoor cats live 15 years on average.",
    },
  ];

  return (
    <main className="container">
      <h1 className="header">Frequently Asked Questions</h1>
      <List data={data} />
    </main>
  );
}
