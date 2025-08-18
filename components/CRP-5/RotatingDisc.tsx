// src/components/RotatingDisc.tsx
"use client";
import React, { useRef, useEffect } from "react";

interface Props {
  angle: number;
  setAngle: (angle: number) => void;
}

/**
 * Renders the interactive rotating disc and handles user input for rotation.
 */
export const RotatingDisc = ({ angle, setAngle }: Props) => {
  const discRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const disc = discRef.current;
    if (!disc) return;

    let isDragging = false;
    let startAngle = 0;
    let rotationOffset = angle;

    const getAngleFromEvent = (e: MouseEvent | TouchEvent): number => {
      const rect = disc.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    };

    const onStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDragging = true;
      startAngle = getAngleFromEvent(e);
      rotationOffset = angle;
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onEnd);
      window.addEventListener("touchmove", onMove);
      window.addEventListener("touchend", onEnd);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const currentAngle = getAngleFromEvent(e);
      const deltaAngle = currentAngle - startAngle;
      setAngle(rotationOffset + deltaAngle);
    };

    const onEnd = () => {
      isDragging = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };

    disc.addEventListener("mousedown", onStart);
    disc.addEventListener("touchstart", onStart, { passive: false });

    return () => {
      disc.removeEventListener("mousedown", onStart);
      disc.removeEventListener("touchstart", onStart);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [angle, setAngle]);

  return (
    <div
      ref={discRef}
      className="rotating-disc"
      style={{ transform: `rotate(${angle}deg)` }}
    >
      {/* A simplified SVG representation of the disc is used here. */}
      {/* In a full build, this would be a detailed, high-fidelity SVG asset. */}
      <svg viewBox="0 0 400 400">
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="#FEF9E7"
          stroke="#873600"
          strokeWidth="2"
        />
        <text
          x="195"
          y="45"
          fontSize="18"
          textAnchor="middle"
          fontWeight="bold"
        >
          60
        </text>
        <text
          x="355"
          y="205"
          fontSize="18"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          15
        </text>
        <text x="195" y="365" fontSize="18" textAnchor="middle">
          30
        </text>
        <text
          x="45"
          y="205"
          fontSize="18"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          45
        </text>
      </svg>
    </div>
  );
};
