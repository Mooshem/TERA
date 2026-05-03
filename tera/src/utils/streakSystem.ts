export function updateStreak(lastActive: string | null) {
  const today = new Date();
  const last = lastActive ? new Date(lastActive) : null;

  if (!last) {
    return { current: 1, lastActive: today.toISOString() };
  }

  const diffDays =
    (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

  // same day → no change
  if (diffDays < 1) {
    return { current: 1, lastActive: lastActive };
  }

  // next day → increment streak
  if (diffDays < 2) {
    return {
      current: (last as any).current + 1 || 1,
      lastActive: today.toISOString(),
    };
  }

  // missed days → reset
  return {
    current: 1,
    lastActive: today.toISOString(),
  };
}