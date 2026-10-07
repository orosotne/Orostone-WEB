import assert from 'node:assert/strict';
import test from 'node:test';
import { createDockMotion } from '../../components/Shop/sampleCartonDock';

const viewport = { scrollY: 0, innerHeight: 900 };
Object.defineProperty(globalThis, 'window', { configurable: true, value: viewport });
const tick = () => new Promise<void>(resolve => setImmediate(resolve));
const rect = (left: number, top: number, width: number) => ({ left, top, width, height: width * 315 / 720, bottom: top + width * 315 / 720 }) as DOMRect;
class Motion {
  finish!: () => void;
  finished = new Promise<void>(resolve => { this.finish = resolve; });
  cancel() { this.finish(); }
}
class Actor {
  motions: Motion[] = [];
  frames: Keyframe[] = [];
  classList = { contains: (name: string) => this.graphic && name === 'sample-carton-graphic' };
  constructor(public bounds: DOMRect, private graphic = false) {}
  getBoundingClientRect() { return this.bounds; }
  animate(frames: Keyframe[]) {
    this.frames = frames;
    const motion = new Motion(); this.motions.push(motion); return motion;
  }
}
const tray = (...actors: Actor[]) => ({ querySelectorAll: () => actors }) as unknown as HTMLElement;

test('flight waits for both the layout commit and its movement', async () => {
  const actor = new Actor(rect(60, 470, 260), true), motion = createDockMotion();
  const before = motion.capture(tray(actor), true);
  let landed = false;
  const wait = motion.settled().then(() => { landed = true; });
  await tick(); assert.equal(landed, false, 'capture is not a finished transition');
  actor.bounds = rect(20, 470, 350); motion.play(before, false);
  await tick(); assert.equal(landed, false, 'the destination is still moving');
  actor.motions.at(-1)!.finish(); await wait; assert.equal(landed, true);
});

test('reversing scroll cannot release a waiting flight between React commits', async () => {
  const actor = new Actor(rect(60, 470, 260), true), motion = createDockMotion();
  motion.play(motion.capture(tray(actor), true), false);
  let landed = false;
  const wait = motion.settled().then(() => { landed = true; });
  actor.bounds = rect(40, 465, 300);
  const reversal = motion.capture(tray(actor), false);
  await tick(); assert.equal(landed, false, 'cancelled old animation must not open the gate');
  actor.bounds = rect(60, 470, 260); motion.play(reversal, false);
  await tick(); assert.equal(landed, false);
  actor.motions.at(-1)!.finish(); await wait;
  assert.equal(actor.frames[0].translate, '-20px -5px', 'continue from the visible intermediate position');
});

test('cartons scale uniformly while action targets keep their size', () => {
  const graphic = new Actor(rect(60, 470, 260), true), button = new Actor(rect(70, 590, 80));
  const motion = createDockMotion(), before = motion.capture(tray(graphic, button), true);
  graphic.bounds = rect(20, 470, 350); button.bounds = rect(30, 650, 100); motion.play(before, false);
  assert.equal(graphic.frames[0].scale, String(260 / 350));
  assert.equal(button.frames[0].scale, '1');
  assert.equal(button.frames[0].translate, '40px -60px');
  motion.cancel();
});

test('only inline starting positions follow scroll before the commit', () => {
  const actor = new Actor(rect(20, 500, 350)), motion = createDockMotion();
  viewport.scrollY = 100;
  const before = motion.capture(tray(actor), false);
  viewport.scrollY = 120; actor.bounds = rect(20, 470, 350); motion.play(before, false);
  assert.equal(actor.frames[0].translate, '0px 10px'); motion.cancel(); viewport.scrollY = 0;
});

test('reduced motion and unmount release waiters without leaving animation work', async () => {
  const actor = new Actor(rect(20, 500, 350)), motion = createDockMotion();
  const before = motion.capture(tray(actor), false), reduced = motion.settled();
  motion.play(before, true); await reduced; assert.equal(actor.motions.length, 0);
  motion.capture(tray(actor), true);
  const unmounted = motion.settled(); motion.cancel(); await unmounted;
});

test('a first pin from below the viewport enters locally without a long fly-in', () => {
  const actor = new Actor(rect(20, 1100, 350), true), motion = createDockMotion();
  const before = motion.capture(tray(actor), false);
  actor.bounds = rect(60, 470, 260); motion.play(before, false);
  assert.equal(actor.frames[0].translate, '0px 6px');
  assert.equal(actor.frames[0].scale, '1');
  assert.equal(actor.frames[0].opacity, 0); motion.cancel();
});
