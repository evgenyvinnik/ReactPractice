import React, { useState, useRef } from "react";
import "./styles.css";

function Input() {
  const [telephone, setTelephone] = useState("");
  const inputRef = useRef(null);

  const countDigitsBefore = (str, pos) => {
    return str.slice(0, pos).replace(/\D/g, "").length;
  };
  
  const findPositionAfterDigits = (formatted, digitCount) => {
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        count++;
        if (count >= digitCount) {
          return i + 1;
        }
      }
    }
    return formatted.length;
  };

  const onPhoneChange = (e) => {
    const input = e.target;
    const cursorPos = input.selectionStart;
    const oldValue = telephone;
    const newValue = input.value;

    // Extract only digits
    const digits = newValue.replace(/\D/g, "").slice(0, 10);
    
    // Format the phone number
    let formatted = "";
    if (digits.length > 0) {
      formatted = "(" + digits.substring(0, 3);
      if (digits.length > 3) {
        formatted += ") " + digits.substring(3, 6);
      }
      if (digits.length > 6) {
        formatted += "-" + digits.substring(6, 10);
      }
    }

    // Calculate new cursor position
    // Key insight: preserve the number of digits before the cursor
    const digitsBeforeCursor = countDigitsBefore(newValue, cursorPos);
    const newCursorPos = findPositionAfterDigits(formatted, digitsBeforeCursor);

    setTelephone(formatted);

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    });
  };

  const onKeyDown = (e) => {
    if (e.key === "Backspace") {
      const cursorPos = e.target.selectionStart;
      const char = telephone[cursorPos - 1];
      
      if (char && /[^\d]/.test(char)) {
        e.preventDefault();
        const newPos = cursorPos - 1;
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    }
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
        onKeyDown={onKeyDown}
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