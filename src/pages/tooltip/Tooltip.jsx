import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import "./styles.css";

const TIMEOUT = 3000;

function TooltipModal({ tooltip, onClose }) {
  return (
    <div className="modal">
      {tooltip}
      <button onClick={onClose}>X</button>
    </div>
  );
}

function ToolTipEnvelope({ tooltip, children }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div onPointerEnter={() => setShowModal(true)}>{children}</div>
      {showModal &&
        createPortal(
          <TooltipModal
            tooltip={tooltip}
            onClose={() => setShowModal(false)}
          />,
          document.body
        )}
    </>
  );
}

export default function Tooltip() {
  return (
    <main className="container">
      <h1 className="header">Tooltip</h1>

      <ToolTipEnvelope tooltip="This is a tooltip">
        <div>this component has tooltip</div>
      </ToolTipEnvelope>
    </main>
  );
}
