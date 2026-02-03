import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";

type NoButtonDodgeProps = {
  label?: string;
  children?: ReactNode;
};

const NoButtonDodge = ({ label = "No", children }: NoButtonDodgeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 140, y: 90 });

  const moveButton = () => {
    if (!containerRef.current || !buttonRef.current) {
      return;
    }
    const container = containerRef.current.getBoundingClientRect();
    const button = buttonRef.current.getBoundingClientRect();
    const padding = 12;
    const maxX = Math.max(0, container.width - button.width - padding * 2);
    const maxY = Math.max(0, container.height - button.height - padding * 2);

    setPosition({
      x: padding + Math.random() * maxX,
      y: padding + Math.random() * maxY,
    });
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) {
      return;
    }
    const button = buttonRef.current.getBoundingClientRect();
    const centerX = button.left + button.width / 2;
    const centerY = button.top + button.height / 2;
    const distance = Math.hypot(centerX - event.clientX, centerY - event.clientY);

    if (distance < 90) {
      moveButton();
    }
  };

  useEffect(() => {
    moveButton();
  }, []);

  return (
    <div
      className="question-wrap"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {children}
      <button
        type="button"
        className="button button-ghost no-button"
        ref={buttonRef}
        style={{ left: position.x, top: position.y }}
        onMouseEnter={moveButton}
        onFocus={moveButton}
      >
        {label}
      </button>
    </div>
  );
};

export default NoButtonDodge;
