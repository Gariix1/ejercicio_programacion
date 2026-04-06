export const MIN_PROCESS_FEEDBACK_MS = 1700;

export async function ensureMinimumProcessFeedbackDuration(
  startedAt: number,
  minimumMs = MIN_PROCESS_FEEDBACK_MS,
): Promise<void> {
  const elapsed = performance.now() - startedAt;
  const remaining = Math.max(minimumMs - elapsed, 0);

  if (!remaining) {
    return;
  }

  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, remaining);
  });
}
