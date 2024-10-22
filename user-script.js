const socket = io(); // Initialize Socket.io
const clockDisplay = document.getElementById('clock');

// Clock state, now controlled by the server
let clockState = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  running: false,
  speed: 1 // Default speed is 1x
};

// Listen for clock updates from the server
socket.on('clockState', (newState) => {
  clockState = newState;
  updateClockDisplay();
});

// Function to update the clock display
function updateClockDisplay() {
  clockDisplay.textContent = `${String(clockState.hours).padStart(2, '0')}:${String(clockState.minutes).padStart(2, '0')}:${String(clockState.seconds).padStart(2, '0')}`;
}
