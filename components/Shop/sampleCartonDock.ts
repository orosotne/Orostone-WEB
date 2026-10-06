const actorSelector = '.sample-carton-graphic, .sample-carton-heading p, .sample-carton-heading > div > span, .sample-carton-continue, .sample-carton-label > span, .sample-carton-label > button';

interface DockSnapshot {
  scrollY: number;
  fixed: boolean;
  actors: { element: HTMLElement; rect: DOMRect }[];
}

/** Keep the same Lottie player and carry its visible position across layouts. */
export function createDockMotion() {
  let animations: Animation[] = [];
  let generation = 0, commit: Promise<void> | null = null, finishCommit: (() => void) | null = null;
  const cancel = () => {
    ++generation;
    animations.forEach(animation => animation.cancel()); animations = [];
    finishCommit?.(); finishCommit = null; commit = null;
  };
  return {
    cancel,
    capture(tray: HTMLElement, fixed: boolean): DockSnapshot {
      const snapshot = {
        scrollY: window.scrollY, fixed,
        actors: Array.from(tray.querySelectorAll<HTMLElement>(actorSelector), element => ({ element, rect: element.getBoundingClientRect() })),
      };
      // A direction change starts at the currently rendered position.
      cancel();
      commit = new Promise<void>(resolve => { finishCommit = resolve; });
      return snapshot;
    },
    play(snapshot: DockSnapshot | null, reduced: boolean) {
      if (!snapshot || reduced) { finishCommit?.(); finishCommit = null; commit = null; return; }
      const scroll = snapshot.fixed ? 0 : window.scrollY - snapshot.scrollY;
      // Read all destinations before starting any compositor animations.
      const actors = snapshot.actors.map(actor => ({ ...actor, destination: actor.element.getBoundingClientRect() }));
      animations = actors.flatMap(({ element, rect, destination }) => {
        if (!destination.width || !destination.height || destination.top >= window.innerHeight || destination.bottom <= 0) return [];
        // First pin can start with the inline tray outside the viewport. Reveal
        // it locally instead of flying it across the screen from that distance.
        const visible = rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
        const dx = visible ? rect.left - destination.left : 0;
        const dy = visible ? rect.top - scroll - destination.top : 6;
        const scale = visible && element.classList.contains('sample-carton-graphic') ? rect.width / destination.width : 1;
        return [element.animate([
          { translate: `${dx}px ${dy}px`, scale: String(scale), opacity: visible ? 1 : 0 },
          { translate: '0px 0px', scale: '1', opacity: 1 },
        ], { duration: 320, easing: 'cubic-bezier(.4,0,.2,1)' })];
      });
      finishCommit?.(); finishCommit = null; commit = null;
    },
    async settled() {
      // A sample flight must measure its destination after a pin transition.
      // Reversing the scroll can replace the animations while we are waiting.
      let current: number;
      do {
        current = generation;
        await commit;
        await Promise.all(animations.map(animation => animation.finished.catch(() => undefined)));
      } while (current !== generation || commit);
    },
  };
}

export type { DockSnapshot };
