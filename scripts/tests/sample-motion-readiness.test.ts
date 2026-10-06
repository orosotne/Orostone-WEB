import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { awaitLottieReady, makeCartonData, preloadSampleTexture, waitForMotionImages } from '../../components/Shop/sampleCartonMotion';
import type { SampleDecor } from '../../components/Shop/sampleCartonMotion';
import { SAMPLE_DECORS } from '../../data/sample-decors';

class FakeAnimation {
  isLoaded = false;
  imagesReady = false;
  imagePreloader = { loadedImages: () => this.imagesReady };
  listeners = new Map<string, Set<() => void>>();
  addEventListener(name: string, listener: () => void) { if (!this.listeners.has(name)) this.listeners.set(name, new Set()); this.listeners.get(name)!.add(listener); }
  removeEventListener(name: string, listener: () => void) { this.listeners.get(name)?.delete(listener); }
  emit(name: string) { for (const listener of [...(this.listeners.get(name) ?? [])]) listener(); }
  listenerCount() { return [...this.listeners.values()].reduce((sum, listeners) => sum + listeners.size, 0); }
  resetSegments() {} goToAndStop() {} setSpeed() {} playSegments() {} destroy() { this.emit('destroy'); }
}

class FakeImage {
  static instances: FakeImage[] = [];
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  complete = false; naturalWidth = 0; naturalHeight = 0; decoding = ''; src = '';
  resolveDecode!: () => void;
  rejectDecode!: () => void;
  decoded = new Promise<void>((resolve, reject) => { this.resolveDecode = resolve; this.rejectDecode = reject; });
  constructor() { FakeImage.instances.push(this); }
  decode() { return this.decoded; }
  load() { this.complete = true; this.naturalWidth = 400; this.naturalHeight = 400; this.onload?.(); }
}
Object.defineProperty(globalThis, 'Image', { configurable: true, value: FakeImage });
Object.defineProperty(globalThis, 'document', { configurable: true, value: { baseURI: 'https://orostone.test/vzorky' } });
const tick = () => new Promise<void>(resolve => setImmediate(resolve));
const data = (name: string) => ({ assets: [{ id: 'stone', u: '/sample-motion/assets/', p: name }] });

test('DOMLoaded alone cannot reveal an SVG whose material is still loading', async () => {
  const animation = new FakeAnimation(); let ready = false;
  const pending = awaitLottieReady(animation).then(() => { ready = true; });
  animation.isLoaded = true; animation.emit('DOMLoaded'); await tick(); assert.equal(ready, false);
  animation.imagesReady = true; animation.emit('loaded_images'); await pending;
  assert.equal(ready, true); assert.equal(animation.listenerCount(), 0);
});

test('cached mounts and either event order satisfy both readiness gates', async () => {
  const cached = new FakeAnimation(); cached.isLoaded = true; cached.imagesReady = true;
  await awaitLottieReady(cached); assert.equal(cached.listenerCount(), 0);
  const animation = new FakeAnimation(); let ready = false;
  const pending = awaitLottieReady(animation).then(() => { ready = true; });
  animation.imagesReady = true; animation.emit('loaded_images'); await tick(); assert.equal(ready, false);
  animation.isLoaded = true; animation.emit('DOMLoaded'); await pending; assert.equal(animation.listenerCount(), 0);
});

test('a pre-configuration empty preloader cannot mark later images ready', async () => {
  const animation = new FakeAnimation(); animation.imagesReady = true; let ready = false;
  const pending = awaitLottieReady(animation).then(() => { ready = true; });
  animation.imagesReady = false; animation.isLoaded = true; animation.emit('DOMLoaded'); await tick(); assert.equal(ready, false);
  animation.imagesReady = true; animation.emit('loaded_images'); await pending; assert.equal(animation.listenerCount(), 0);
});

test('aborted and destroyed mounts reject and remove every readiness listener', async () => {
  const animation = new FakeAnimation(), controller = new AbortController();
  const pending = awaitLottieReady(animation, { signal: controller.signal }); controller.abort();
  await assert.rejects(pending, { name: 'AbortError' }); assert.equal(animation.listenerCount(), 0);
  const destroyed = new FakeAnimation(), other = awaitLottieReady(destroyed); destroyed.destroy();
  await assert.rejects(other, /destroyed/); assert.equal(destroyed.listenerCount(), 0);
});

test('image preparation waits for decode and reuses successful preparation', async () => {
  const before = FakeImage.instances.length; let ready = false;
  const pending = waitForMotionImages(data('decode-gate.webp')).then(() => { ready = true; });
  const image = FakeImage.instances.at(-1)!; image.load(); await tick(); assert.equal(ready, false);
  image.resolveDecode(); await pending; assert.equal(ready, true);
  await waitForMotionImages(data('decode-gate.webp')); assert.equal(FakeImage.instances.length, before + 1);
});

test('failed image loads and decodes are evicted so a new attempt can succeed', async () => {
  const first = waitForMotionImages(data('retry-load.webp')); FakeImage.instances.at(-1)!.onerror?.();
  await assert.rejects(first, /failed to load/);
  const retry = waitForMotionImages(data('retry-load.webp')), image = FakeImage.instances.at(-1)!;
  image.load(); image.resolveDecode(); await retry;
  const failedDecode = waitForMotionImages(data('retry-decode.webp')), broken = FakeImage.instances.at(-1)!;
  broken.load(); broken.rejectDecode(); await assert.rejects(failedDecode, /failed to decode/);
  const decodeRetry = waitForMotionImages(data('retry-decode.webp')), valid = FakeImage.instances.at(-1)!;
  valid.load(); valid.resolveDecode(); await decodeRetry;
});

test('timeouts reject safely and remain retryable', async () => {
  const timedOut = waitForMotionImages(data('retry-timeout.webp'), { timeoutMs: 5 });
  await assert.rejects(timedOut, /timeout/);
  const retry = waitForMotionImages(data('retry-timeout.webp')), image = FakeImage.instances.at(-1)!;
  image.load(); image.resolveDecode(); await retry;
  const animation = new FakeAnimation(); await assert.rejects(awaitLottieReady(animation, { timeoutMs: 5 }), /timeout/);
  assert.equal(animation.listenerCount(), 0);
});

test('caller cancellation does not corrupt shared image preparation', async () => {
  const controller = new AbortController(), cancelled = waitForMotionImages(data('shared.webp'), { signal: controller.signal });
  const shared = waitForMotionImages(data('shared.webp')); controller.abort(); await assert.rejects(cancelled, { name: 'AbortError' });
  const image = FakeImage.instances.at(-1)!; image.load(); image.resolveDecode(); await shared;
});

test('active-model prewarming shares the exact native material URL and decode cache', async () => {
  const decor = SAMPLE_DECORS.find(item => item.id === 'super-white-extra')!, before = FakeImage.instances.length;
  const prewarm = preloadSampleTexture(decor), image = FakeImage.instances.at(-1)!;
  assert.equal(image.src, 'https://orostone.test/sample-motion/assets/textures-hd/super-white-extra.webp');
  const native = waitForMotionImages({ assets: [{ u: '/sample-motion/assets/textures-hd/', p: 'super-white-extra.webp' }] });
  assert.equal(FakeImage.instances.length, before + 1); image.load(); image.resolveDecode(); await Promise.all([prewarm, native]);
});

const cartons = JSON.parse(readFileSync(new URL('../../public/sample-motion/cartons.json', import.meta.url), 'utf8'));
const removal = JSON.parse(readFileSync(new URL('../../public/sample-motion/removal.json', import.meta.url), 'utf8'));
const assets = { cartons, removal, runtime: { loadAnimation() { throw new Error('Rendering is outside this pure data test'); } } };
const modes = ['idle', 'insert', 'remove', 'package'] as const;
function assertModelAsset(data: ReturnType<typeof makeCartonData>, slot: number, id: string, context: string) {
  const selected = data.assets.find((asset: { id: string }) => asset.id === 'selected-' + slot);
  assert.ok(selected, context + ': selected slot dependency exists');
  assert.equal(selected.layers[0].refId, 'stone-hd-' + id, context + ': selected slot uses the requested model');
  const texture = data.assets.find((asset: { id: string }) => asset.id === 'stone-hd-' + id);
  assert.equal(texture.p, id + '.webp', context + ': exact model photograph');
  assert.equal(texture.u, '/sample-motion/assets/textures-hd/', context + ': production material path');
}
function assertValidReferences(data: ReturnType<typeof makeCartonData>, context: string) {
  const ids = new Set(data.assets.map((asset: { id: string }) => asset.id));
  for (const parent of [data, ...data.assets]) for (const layer of parent.layers ?? []) if (layer.refId) assert.ok(ids.has(layer.refId), context + ': missing dependency ' + layer.refId);
}

test('all 12 models retain their identity in all three slots and four motion modes', () => {
  const original = JSON.stringify({ cartons, removal });
  for (const decor of SAMPLE_DECORS) for (const slot of [0, 1, 2]) for (const mode of modes) {
    const slots: (SampleDecor | null)[] = [null, null, null]; slots[slot] = decor;
    const context = decor.id + ' / slot ' + slot + ' / ' + mode;
    const motion = makeCartonData(assets, slots, [0, 1, 2], mode, slot);
    assertModelAsset(motion, slot, decor.id, context); assertValidReferences(motion, context);
    assert.equal(motion.assets.filter((asset: { id: string }) => asset.id.startsWith('stone-hd-')).length, 1, context + ': unselected models cannot leak into the scene');
  }
  assert.equal(JSON.stringify({ cartons, removal }), original, 'Creator exports remain unchanged');
});

test('mixed selections and a nonadjacent replacement slot do not exchange textures', () => {
  for (let index = 0; index < SAMPLE_DECORS.length; index++) for (const mode of modes) {
    const slots = [0, 1, 2].map(offset => SAMPLE_DECORS[(index + offset) % SAMPLE_DECORS.length]);
    const context = 'mixed ' + index + ' / ' + mode;
    const motion = makeCartonData(assets, slots, [0, 1, 2], mode, index % 3);
    slots.forEach((decor, slot) => assertModelAsset(motion, slot, decor.id, context)); assertValidReferences(motion, context);
    assert.equal(motion.assets.filter((asset: { id: string }) => asset.id.startsWith('stone-hd-')).length, 3);
  }
  const slots = [SAMPLE_DECORS[2], null, SAMPLE_DECORS[5]];
  for (const mode of modes) {
    const motion = makeCartonData(assets, slots, [0, 2], mode, 2);
    assertModelAsset(motion, 0, 'super-white-extra', mode); assertModelAsset(motion, 2, 'calacatta-top', mode); assertValidReferences(motion, mode);
  }
});
