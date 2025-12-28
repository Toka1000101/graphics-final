let audioUnlocked = false;
let htmlAudio = null;

export function initMusic() {
  htmlAudio = new Audio('assets/daft-punk-around-the-world.mp3');
  htmlAudio.loop = true;
  htmlAudio.volume = 0.85;
  htmlAudio.preload = 'auto';

  const unlockAudioContext = () => {
    if (audioUnlocked) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    oscillator.frequency.value = 0.0001;
    oscillator.connect(ctx.destination);
    oscillator.start(0);
    oscillator.stop(0.001);
    audioUnlocked = true;
    document.removeEventListener('touchstart', unlockAudioContext);
    document.removeEventListener('click', unlockAudioContext);
  };

  document.addEventListener('touchstart', unlockAudioContext, { once: true });
  document.addEventListener('click', unlockAudioContext, { once: true });
}

export function startMusic() {
  if (!htmlAudio) return;

  const playPromise = htmlAudio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log("Music playing!");
      })
      .catch(err => {
        console.warn("Still blocked (very rare)", err);
      });
  }
}

window.startMusic = startMusic;


