const socket = io(); // Initialize Socket.io

// Admin credentials
const adminUsername = "admin";
const adminPassword = "password123";

// Get DOM elements
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('loginMessage');
const clockContainer = document.getElementById('clockContainer');
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

// Login function for admin
loginBtn.addEventListener('click', () => {
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (username === adminUsername && password === adminPassword) {
    loginMessage.textContent = "";
    clockContainer.style.display = "block"; // Show clock and controls
    document.getElementById('adminLogin').style.display = "none"; // Hide login form
  } else {
    loginMessage.textContent = "Invalid username or password.";
  }
});

// Admin controls: Start, Pause, Reset, and Speed changes
document.getElementById('startBtn').addEventListener('click', () => {
  if (!clockState.running) {
    clockState.running = true;
    socket.emit('updateClock', clockState); // Send clock state to server
  }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  clockState.running = !clockState.running;
  socket.emit('updateClock', clockState); // Send clock state to server
});

document.getElementById('resetBtn').addEventListener('click', () => {
  clockState = {
    hours: parseInt(document.getElementById('startHourInput').value),
    minutes: parseInt(document.getElementById('startMinuteInput').value),
    seconds: parseInt(document.getElementById('startSecondInput').value),
    running: false,
    speed: parseInt(document.getElementById('speedInput').value)
  };
  socket.emit('updateClock', clockState); // Send clock state to server
  updateClockDisplay();
});

document.getElementById('speedInput').addEventListener('input', () => {
  clockState.speed = parseInt(document.getElementById('speedInput').value);
  socket.emit('updateClock', clockState); // Send clock state to server
});

// Function to update the clock display
function updateClockDisplay() {
  clockDisplay.textContent = `${String(clockState.hours).padStart(2, '0')}:${String(clockState.minutes).padStart(2, '0')}:${String(clockState.seconds).padStart(2, '0')}`;
}
