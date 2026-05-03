export function calculateLevel(points: number) {
  // log-based scaling
  const level = Math.floor(Math.log10(points + 1) * 5) + 1;

  return level;
}

/**
 * Progress to next level (0–1)
 */
export function levelProgress(points: number) {
  const currentLevel = calculateLevel(points);
  const currentMin = Math.pow(10, (currentLevel - 1) / 5) - 1;
  const nextMin = Math.pow(10, currentLevel / 5) - 1;

  return (points - currentMin) / (nextMin - currentMin);
}