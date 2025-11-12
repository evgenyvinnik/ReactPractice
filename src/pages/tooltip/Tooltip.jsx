import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTooltipPosition } from "./useTooltipPosition";
import "./styles.css";

const TIMEOUT = 1000;

const TooltipEnvelope = ({
  tooltip,
  children,
  sticky = false,
  autoDismissAfter = TIMEOUT,
}) => {
  const [visible, setVisible] = useState(false);
  const targetRef = useRef(null);
  const tipRef = useRef(null);
  const timeoutRef = useRef(null);

  const effectiveSticky = sticky || autoDismissAfter === 0;
  const effectiveTimeout = effectiveSticky ? null : autoDismissAfter ?? TIMEOUT;

  const pos = useTooltipPosition(targetRef, tipRef, [visible, tooltip]);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startTimer = () => {
    if (!effectiveTimeout) return;
    clearTimer();
    timeoutRef.current = setTimeout(() => setVisible(false), effectiveTimeout);
  };

  useEffect(() => {
    if (!visible || effectiveSticky) return;
    const handleMove = () => startTimer();
    window.addEventListener("pointermove", handleMove, { passive: true });
    startTimer();
    return () => {
      window.removeEventListener("pointermove", handleMove);
      clearTimer();
    };
  }, [visible, effectiveSticky, effectiveTimeout]);

  const onClose = () => {
    clearTimer();
    setVisible(false);
  };

  return (
    <>
      <div
        ref={targetRef}
        onPointerEnter={() => setVisible(true)}
        className="tooltip-target"
      >
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            ref={tipRef}
            className="tooltip-modal"
            style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
            onPointerMove={startTimer}
          >
            <div className="tooltip-content">{tooltip}</div>
            {effectiveSticky && (
              <button
                onClick={onClose}
                className="tooltip-close"
                aria-label="Close tooltip"
              >
                ×
              </button>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default function Tooltip() {
  return (
    <main className="tooltip-container">
      <h1 className="tooltip-header">Tooltip Demo</h1>

      <div className="tooltip-section">
        <h3>Default (auto-dismiss after 1s of inactivity)</h3>
        <TooltipEnvelope tooltip="This tooltip will auto-dismiss after the default timeout">
          <div className="demo-item">Hover me (default)</div>
        </TooltipEnvelope>
      </div>

      <div className="tooltip-section">
        <h3>Custom auto-dismiss (5s)</h3>
        <TooltipEnvelope
          tooltip="This tooltip auto-dismisses after 5s"
          autoDismissAfter={2000}
        >
          <div className="demo-item">Hover me (2s)</div>
        </TooltipEnvelope>
      </div>

      <div className="tooltip-section">
        <h3>Sticky (manual close)</h3>
        <TooltipEnvelope
          tooltip="This tooltip stays open until you click X"
          sticky={true}
        >
          <div className="demo-item">Hover me (sticky)</div>
        </TooltipEnvelope>
      </div>

      <div className="tooltip-section">
        <h3>autoDismissAfter = 0 (treated as sticky)</h3>
        <TooltipEnvelope
          tooltip="This tooltip has X because autoDismissAfter=0"
          autoDismissAfter={0}
        >
          <div className="demo-item">Hover me (0 behaves sticky)</div>
        </TooltipEnvelope>
      </div>
    </main>
  );
}
