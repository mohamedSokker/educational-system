// src/components/CRP5.tsx
"use client";
import React, { useState } from "react";
import { Base } from "./Base";
import { RotatingDisc } from "./RotatingDisc";
import * as flightComputer from "./flightComputer";
import "./CRP5.css";

/**
 * The main component for the CRP-5 Flight Computer.
 * It manages the state and orchestrates the child components.
 */
export const CRP5 = () => {
  // State for the UI
  const [discAngle, setDiscAngle] = useState<number>(0);

  // --- State for a sample calculation: Wind Triangle ---
  const [course, setCourse] = useState<number>(40);
  const [trueAirspeed, setTrueAirspeed] = useState<number>(180);
  const [windDirection, setWindDirection] = useState<number>(350);
  const [windSpeed, setWindSpeed] = useState<number>(30);

  // Perform the wind calculation using the logic module
  const windResult = flightComputer.solveWindTriangle(
    course,
    trueAirspeed,
    windDirection,
    windSpeed
  );

  // --- State for a sample calculation: Speed/Distance/Time ---
  // The ratio is set by aligning the outer scale (speed) with the inner scale '60' mark.
  // The rotation of the disc conceptually sets this ratio.
  const speedForRatio = 150; // Example: 150 kts on outer scale
  const timeForCalc = 45; // Example: Find distance for 45 minutes
  const distanceResult = flightComputer.calculateDistance(
    speedForRatio,
    timeForCalc
  );

  return (
    <div className="app-container">
      <h1>CRP-5 Flight Computer</h1>
      <div className="crp5-container">
        <div className="crp5-interactive-area">
          <Base />
          <RotatingDisc angle={discAngle} setAngle={setDiscAngle} />
        </div>
        <div className="crp5-readout-panel">
          <h3>Calculation Readouts</h3>
          <div className="readout-group">
            <h4>Wind Triangle</h4>
            <p>
              <strong>Course:</strong> {course}°
            </p>
            <p>
              <strong>TAS:</strong> {trueAirspeed} kts
            </p>
            <p>
              <strong>Wind:</strong> {windDirection}° @ {windSpeed} kts
            </p>
            <hr />
            <p className="result">
              <strong>Required Heading:</strong> {windResult.heading}°
            </p>
            <p className="result">
              <strong>Groundspeed:</strong> {windResult.groundspeed} kts
            </p>
          </div>
          <div className="readout-group">
            <h4>Speed / Distance / Time</h4>
            <p>
              When aligning <strong>{speedForRatio} kts</strong> on the outer
              scale...
            </p>
            <p>
              ...the distance traveled in <strong>{timeForCalc} minutes</strong>{" "}
              is:
            </p>
            <hr />
            <p className="result">
              <strong>Distance:</strong> {distanceResult.toFixed(1)} NM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
