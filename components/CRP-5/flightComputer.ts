// src/logic/flightComputer.ts

interface WindResult {
    heading: number;
    groundspeed: number;
}

/**
 * Solves the logarithmic ratio at the heart of the circular slide rule.
 * @param outerValue - The value on the outer scale (e.g., speed).
 * @param innerValue - The value aligned with it on the inner scale (e.g., 60 for time).
 * @param newInnerValue - The new value on the inner scale to read against.
 * @returns The corresponding value on the outer scale.
 */
const solveRatio = (outerValue: number, innerValue: number, newInnerValue: number): number => {
    if (innerValue === 0) return 0;
    const ratio = outerValue / innerValue;
    return newInnerValue * ratio;
};

/**
 * Calculates distance given speed and time by setting the standard time/speed ratio.
 * @param speedInKnots - Speed (TAS or Groundspeed).
 * @param timeInMinutes - Time of flight.
 * @returns Distance in Nautical Miles.
 */
export const calculateDistance = (speedInKnots: number, timeInMinutes: number): number => {
    // On a CRP-5, you align speed (outer) with 60 minutes (inner).
    return solveRatio(speedInKnots, 60, timeInMinutes);
};

/**
 * Solves the wind triangle using the Laws of Sines and Cosines to find heading and groundspeed.
 * @param course - Intended track over ground (degrees).
 * @param trueAirspeed - TAS of the aircraft (knots).
 * @param windDirection - Direction wind is FROM (degrees).
 * @param windSpeed - Speed of the wind (knots).
 * @returns The required heading to fly and the resulting groundspeed.
 */
export const solveWindTriangle = (course: number, trueAirspeed: number, windDirection: number, windSpeed: number): WindResult => {
    const courseRad = course * (Math.PI / 180);
    const windDirectionRad = windDirection * (Math.PI / 180);

    const windAngle = windDirectionRad - courseRad;

    // Law of Cosines to find Groundspeed
    const groundspeed = Math.sqrt(
        trueAirspeed ** 2 + windSpeed ** 2 - 2 * trueAirspeed * windSpeed * Math.cos(windAngle)
    );

    // Law of Sines to find Wind Correction Angle (WCA)
    let sinWCA = (windSpeed * Math.sin(windAngle)) / groundspeed;
    sinWCA = Math.max(-1, Math.min(1, sinWCA)); // Clamp to handle floating point errors
    
    const wcaDeg = Math.asin(sinWCA) * (180 / Math.PI);
    let heading = (course + wcaDeg + 360) % 360;

    return {
        heading: Math.round(heading),
        groundspeed: Math.round(groundspeed),
    };
};