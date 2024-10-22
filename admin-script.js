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

// Clock variables
let clockInterval;
let clockState = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  running: false,
  speed: 1 // Default speed multiplier is 1x
};

// Login function for admin
loginBtn.addEventListener('click', () => {
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (username === adminUsername && password === adminPassword) {
    loginMessage.textContent = "";
    clockContainer.style.display = "block"; // Show clock and controls
    document.getElementById('adminLogin').style.display = "none"; // Hide login form
    socket.emit('updateClock', clockState); // Sync clock state with the server
  } else {
    loginMessage.textContent = "Invalid username or password.";
  }
});

// Admin controls: Start, Pause, Reset, and Speed changes
document.getElementById('startBtn').addEventListener('click', () => {
  if (!clockState.running) {
    clockState.running = true;
    startClockInterval();
    socket.emit('updateClock', clockState); // Send clock state to server
  }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  clockState.running = !clockState.running;
  if (clockState.running) {
    startClockInterval();
  } else {
    clearInterval(clockInterval);
  }
  socket.emit('updateClock', clockState); // Send clock state to server
});

document.getElementById('resetBtn').addEventListener('click', () => {
  clearInterval(clockInterval);
  clockState = {
    hours: parseInt(document.getElementById('startHourInput').value),
    minutes: parseInt(document.getElementById('startMinuteInput').value),
    seconds: parseInt(document.getElementById('startSecondInput').value),
    running: false,
    speed: parseInt(document.getElementById('speedInput').value)
  };
  updateClockDisplay();
  socket.emit('updateClock', clockState); // Send clock state to server
});

document.getElementById('speedInput').addEventListener('input', () => {
  clockState.speed = parseInt(document.getElementById('speedInput').value);
  socket.emit('updateClock', clockState); // Send clock state to server
});

// Start clock interval based on speed multiplier
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
    socket.emit('updateClock', clockState); // Sync updated clock state with server
  }, 1000 / clockState.speed); // Adjust for speed multiplier
}

// Display the clock
function updateClockDisplay() {
  clockDisplay.textContent = `${String(clockState.hours).padStart(2, '0')}:${String(clockState.minutes).padStart(2, '0')}:${String(clockState.seconds).padStart(2, '0')}`;
}
