export type Sound = 'startup' | 'hardware' | 'tap' | 'alert' | 'success';
let context: AudioContext | undefined;
let master: GainNode | undefined;
let enabled = false;
let level = .65;
const assets: Partial<Record<Sound, string>> = { startup: '/media/startup-chime.mp3', hardware: '/media/transition-hardware.mp3', tap: '/media/haptic-tap.mp3', alert: '/media/cyber-alert.mp3' };
const buffers = new Map<Sound, AudioBuffer>();
let loading = false;
function prepareAssets() {
  if (loading || !context) return;
  loading = true;
  for (const [name, url] of Object.entries(assets)) {
    fetch(url).then(response => { if (!response.ok) throw new Error(); return response.arrayBuffer(); }).then(bytes => context!.decodeAudioData(bytes)).then(buffer => buffers.set(name as Sound, buffer)).catch(() => { /* Synthesized fallback remains available. */ });
  }
}
export function configureAudio(on: boolean, volume: number) {
  enabled = on; level = Math.max(0, Math.min(1, volume / 100));
  if (context && master) master.gain.setTargetAtTime(on ? level : 0, context.currentTime, .015);
}
export function playSound(sound: Sound) {
  if (!enabled || !level) return;
  try {
    context ||= new AudioContext();
    if (!master) { master = context.createGain(); master.connect(context.destination); }
    master.gain.value = level;
    prepareAssets();
    // Called only from a user gesture. Never queue surprise autoplay for later.
    void context.resume().catch(() => {});
    const buffer = buffers.get(sound);
    if (buffer) { const source = context.createBufferSource(); const gain = context.createGain(); source.buffer = buffer; gain.gain.value = .4; source.connect(gain).connect(master); source.start(0, 0, sound === 'tap' ? Math.min(.01, buffer.duration) : buffer.duration); source.onended = () => { source.disconnect(); gain.disconnect(); }; return; }
    const now = context.currentTime;
    const frequencies = sound === 'startup' ? [92.499, 138.591, 184.997, 233.082, 277.183, 369.994] : sound === 'success' ? [440, 554.365, 659.255] : sound === 'alert' ? [440, 466.164] : sound === 'hardware' ? [92, 1200] : [1600];
    frequencies.forEach((frequency, index) => {
      const node = context!.createOscillator(); const gain = context!.createGain();
      const pan = context!.createStereoPanner(); pan.pan.value = (index / Math.max(1, frequencies.length - 1) - .5) * .6;
      const duration = sound === 'tap' ? .01 : sound === 'hardware' ? (index ? .035 : .8) : sound === 'startup' ? 1.6 : .4;
      node.type = sound === 'startup' ? 'triangle' : 'sine'; node.frequency.setValueAtTime(frequency, now);
      if (sound === 'hardware' && !index) node.frequency.exponentialRampToValueAtTime(35, now + duration);
      gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.09 / frequencies.length, now + Math.min(.015, duration / 3));
      gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
      node.connect(gain).connect(pan).connect(master!); node.start(now); node.stop(now + duration);
      node.onended = () => { node.disconnect(); gain.disconnect(); pan.disconnect(); };
    });
  } catch { /* Sound is optional, including in browsers without Web Audio. */ }
}
