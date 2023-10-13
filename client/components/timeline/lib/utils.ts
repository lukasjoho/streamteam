import SETTINGS from "./constants";

export function roundToNearestMultiple(currentPos: number) {
  const nearestMultiple =
    Math.round(currentPos / SETTINGS.UNIT_WIDTH) * SETTINGS.UNIT_WIDTH;
  const remainder = currentPos % SETTINGS.UNIT_WIDTH;
  if (remainder > 0.5 * SETTINGS.UNIT_WIDTH) {
    return nearestMultiple - SETTINGS.UNIT_WIDTH / 2;
  } else {
    return nearestMultiple + SETTINGS.UNIT_WIDTH / 2;
  }
}
