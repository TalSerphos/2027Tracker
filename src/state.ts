// Tiny reactive store shared across the scene, slider and branch visualization.

type Listener = (utopia: number) => void;

let utopia = 38; // 0–100, probability of the utopia/slowdown path
const listeners = new Set<Listener>();

export function getUtopia(): number {
  return utopia;
}

/** Set the current utopia probability and notify subscribers. */
export function setUtopia(value: number): void {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  if (clamped === utopia) return;
  utopia = clamped;
  for (const l of listeners) l(utopia);
}

/** Subscribe to changes. Returns an unsubscribe function. Fires immediately. */
export function onUtopia(listener: Listener): () => void {
  listeners.add(listener);
  listener(utopia);
  return () => listeners.delete(listener);
}
