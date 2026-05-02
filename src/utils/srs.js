// Returns a human-readable string for the next review interval given the
// current SRS progress entry and the rating the user is about to give.
export const previewInterval = (cardProgress, known) => {
  if (known) {
    const reps = cardProgress?.repetitions ?? 0;
    if (reps === 0) return '1d';
    if (reps === 1) return '6d';
    return `${Math.round((cardProgress?.interval ?? 1) * (cardProgress?.easeFactor ?? 2.5))}d`;
  }
  return '1d';
};
