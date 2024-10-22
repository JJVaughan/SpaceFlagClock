const socket = io(); // Initialize Socket.io
const clockDisplay = document.getElementById('clock');

// Clock state for users, which is purely for display
let clockState = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  running: false,
  speed: 1 // Default speed multiplier is 1x
};

// Listen for clock updates from the server
socket.on('clockState', (newState) => {
  clockState = newState;
  updateClockDisplay();
  if (clockState.running) {
    startClockInterval();
  } else {
    clearInterval(clockInterval);
  }
});

// Start the clock interval based on the speed received from the admin
let clockInterval;
function startClockInterval() {
  clearInterval(clockInterval);
  clockInterval = setInterval(() => {
    clockState.seconds += 1;
    if (clockState.seconds === 60) {
      clockState.seconds = 0;
      clockState.minutes += 1;
      if (clockState.minutes === 60) {
        clockState.minutes = 0;
        clockState.hours += 1;
        if (clockState.hours === 24) clockState.hours = 0;
      }
    }
    updateClockDisplay();
  }, 1000 / clockState.speed); // Adjust for speed multiplier
}

// Display the clock
function updateClockDisplay() {
  clockDisplay.textContent = `${String(clockState.hours).padStart(2, '0')}:${String(clockState.minutes).padStart(2, '0')}:${String(clockState.seconds).padStart(2, '0')}`;
}
