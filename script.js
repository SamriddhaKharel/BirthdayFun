const candlesContainer = document.getElementById('candles-container');
const displayPositiveMessages = () => {
  const messages = [
    "🎢 Life's a thrilling ride, and I'm so glad we're on it together! 🎡",
    "Thanks for being an amazing friend you're truly the best!🌟.",
    "Wishing you a year filled with joy, health, and all the happiness you deserve! 🎉🍀",
    "Stay safe and always keep smiling. Your happiness and laugh brings joy to everyone around you.😊💫"
  ];

  const messageContainer = document.createElement('div');
  messageContainer.className = 'positive-messages';
  messageContainer.style.position = 'fixed'; // Fix position
  messageContainer.style.top = '50%'; // Center vertically
  messageContainer.style.left = '50%'; // Center horizontally
  messageContainer.style.transform = 'translate(-50%, -50%)'; // Adjust the exact center
  messageContainer.style.textAlign = 'center'; // Center text inside the container
  messageContainer.style.zIndex = '1000'; // Ensure it is on top of other elements
  messageContainer.style.width = '80%'; // Manageable width
  messageContainer.style.fontSize = '24px'; // Increase font size for better readability
  messageContainer.style.fontFamily = "'Brush Script MT', cursive"; // Set cursive font


  document.body.appendChild(messageContainer);

  messages.forEach((message, index) => {
    setTimeout(() => {
      const msgElement = document.createElement('p');
      msgElement.textContent = message;
      messageContainer.appendChild(msgElement);
    }, 4000 * (index + 1)); // Display each message 4 seconds apart
  });
}
// Generate 20 candles dynamically
for (let i = 0; i < 20; i++) {
  const candle = document.createElement('div');
  candle.className = 'candle';

  const eyes = document.createElement('div');
  eyes.className = 'candle__eyes';

  const leftEye = document.createElement('div');
  leftEye.className = 'candle__eye';

  const rightEye = document.createElement('div');
  rightEye.className = 'candle__eye';

  eyes.appendChild(leftEye);
  eyes.appendChild(rightEye);

  const mouth = document.createElement('div');
  mouth.className = 'candle__mouth';

  const flame = document.createElement('div');
  flame.id = 'flame';

  const smoke = document.createElement('div');
  smoke.className = 'smoke';

  candle.appendChild(eyes);
  candle.appendChild(mouth);
  candle.appendChild(flame);
  candle.appendChild(smoke);
  candlesContainer.appendChild(candle);
}

// Initialize blow count
let blowCount = 0;
const maxBlowCount = 5;

// Select candles and flames
const flames = document.querySelectorAll('#flame');
const smokes = document.querySelectorAll('.smoke');
const candles = document.querySelectorAll('.candle');

// Function to play the birthday song
const playBirthdaySong = () => {
const audio = new Audio('videoplayback.mp3');
  audio.play();
};

// Function to show balloons
const showBalloons = () => {
  const balloonContainer = document.createElement('div');
  balloonContainer.classList.add('balloon-container');

  for (let i = 0; i < 20; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
    balloon.style.left = `${Math.random() * 100}vw`;
    balloon.style.animationDelay = `${Math.random() * 3}s`;
    balloonContainer.appendChild(balloon);
  }

  document.body.appendChild(balloonContainer);
};

// Function to show confetti
const showConfetti = () => {
  const confetti = new ConfettiGenerator({ target: 'confetti' });
  confetti.render();
};

// Append canvas for confetti
const confettiCanvas = document.createElement('canvas');
confettiCanvas.id = 'confetti';
document.body.appendChild(confettiCanvas);

const blowOutCandles = () => {
  blowCount++;

  if (blowCount <= maxBlowCount) {
    // Temporarily blow out candles
    flames.forEach(flame => (flame.style.display = 'none'));
    smokes.forEach(smoke => (smoke.style.opacity = '1'));
    document.body.classList.add('dark'); // Change background to dark

    // Make candles angry
    candles.forEach(candle => candle.classList.add('angry'));

    setTimeout(() => {
      if (blowCount < maxBlowCount) {
        // Restore candles if not fully blown
        flames.forEach(flame => (flame.style.display = 'block'));
        smokes.forEach(smoke => (smoke.style.opacity = '0'));
        candles.forEach(candle => candle.classList.remove('angry'));
        document.body.classList.remove('dark'); // Restore background
      } else {
        // Fully blow out candles after 6th attempt
        smokes.forEach(smoke => (smoke.style.opacity = '1'));
        document.body.classList.add('dark');
        document.querySelector('.birthday-wish').textContent = '🎉 Make a wish! 🎂';
        displayPositiveMessages();

        candles.forEach(candle => {
          candle.classList.remove('angry');
          candle.style.backgroundColor = 'gray'; // Change candle appearance
        });

        // Show confetti, balloons, and play the birthday song
        showConfetti();
        showBalloons();
        playBirthdaySong(); // Play the birthday song
      }
    }, 2000);
  }
};

// Microphone input for blowing out candles
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(stream => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      analyser.fftSize = 2048;
      microphone.connect(analyser);

      let debounceTimeout;
      const detectBlow = () => {
        analyser.getByteTimeDomainData(dataArray);

        // Calculate volume
        const volume = dataArray.reduce((sum, value) => sum + Math.abs(value - 128), 0) / dataArray.length;

        // Check if volume exceeds threshold
        if (volume > 20) {
          if (!debounceTimeout) {
            blowOutCandles();
            debounceTimeout = setTimeout(() => (debounceTimeout = null), 2000);
          }
        }

        requestAnimationFrame(detectBlow);
      };

      detectBlow();
    })
    .catch(err => console.error('Microphone access denied:', err));
}
