import React, { useState, useRef } from "react";
import "./styles.css";

function Input() {
  const [telephone, setTelephone] = useState("");
  const inputRef = useRef(null);

  const onPhoneChange = (e) => {
    // console.log(e.currentTarget.value);
    const input = e.target;
    let start = input.selectionStart;
    console.log('start', start);

    let value = input.value;
    let digits = [];
    for (let i = 0; i < value.length; i++) {
      if (
        value.charCodeAt(i) >= "0".charCodeAt(0) &&
        value.charCodeAt(i) <= "9".charCodeAt(0)
      ) {
        digits.push(value.charAt(i));
      }
    }

    let digitString = digits.slice(0, 10);
    const length = digitString.length;

    if (length > 6) {
      digitString.splice(6, 0, "-");
      if(start > 6) {
        start++;
      }
    }
    if (length > 3) {
      digitString.splice(3, 0, ")", " ");
      start+=2
    }
    if (length > 0) {
      digitString.splice(0, 0, "(");
      start++;
    }

    setTelephone(digitString.join(""));

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(start, start);
      }
    });
  };

  return (
    <div>
      <input
        ref={inputRef}
        placeholder="(555) 555-5555"
        type="text"
        autoFocus={true}
        value={telephone}
        className="phoneInput"
        onChange={onPhoneChange}
      />
    </div>
  );
}

export default function PhoneInput() {
  return (
    <main className="container">
      <h1>Phone Input (custom)</h1>
      <Input />
    </main>
  );
}
