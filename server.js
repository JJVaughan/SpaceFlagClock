const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Initial clock state, controlled by the server
let clockState = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  running: false,
  speed: 1 // Default multiplier is 1x
};

let clockInterval; // Interval for the server-side clock

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Route for the admin page (served at root "/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Route for the user page (served at "/user")
app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'user.html'));
});

// Function to start the clock on the server
function startClock() {
  if (clockInterval) return; // Don't start if it's already running

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
    // Broadcast the updated clock state to all connected clients
    io.emit('clockState', clockState);
  }, 1000 / clockState.speed); // Adjust for speed multiplier
}

// Function to stop the clock on the server
function stopClock() {
  clearInterval(clockInterval);
  clockInterval = null;
}

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Send the current clock state to newly connected clients
  socket.emit('clockState', clockState);

  // Handle updates from the admin
  socket.on('updateClock', (newState) => {
    clockState = newState; // Update the clock state on the server

    // Start or stop the clock based on the updated state
    if (clockState.running) {
      startClock();
    } else {
      stopClock();
    }

    // Broadcast the updated state to all clients
    io.emit('clockState', clockState);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// For Render: Use the environment port, defaulting to 3000 locally
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
