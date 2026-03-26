export function clamp01(n) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function calculateStudentProgress({
  lecturesCompleted = 0,
  lecturesTotal = 12,
  drivingCompleted = 0,
  drivingTotal = null,
  writtenTestPassed = false,
  drivingTestScheduled = false,
}) {
  const lecturePart = 0.4 * clamp01(lecturesTotal ? lecturesCompleted / lecturesTotal : 0);

  const effectiveDrivingTotal =
    typeof drivingTotal === 'number' && drivingTotal > 0
      ? drivingTotal
      : Math.max(5, drivingCompleted || 0);

  const drivingPart = 0.4 * clamp01(effectiveDrivingTotal ? drivingCompleted / effectiveDrivingTotal : 0);
  const writtenPart = writtenTestPassed ? 0.1 : 0;
  const practicalPart = drivingTestScheduled ? 0.1 : 0;

  return clamp01(lecturePart + drivingPart + writtenPart + practicalPart);
}

