const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Initial clock state, controlled by admin
let clockState = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  running: false,
  speed: 1 // Default multiplier is 1x
};

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

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Send the current clock state to newly connected clients
  socket.emit('clockState', clockState);

  // Handle updates from the admin
  socket.on('updateClock', (newState) => {
    clockState = newState; // Update the clock state on the server
    io.emit('clockState', clockState); // Broadcast the updated state to all clients
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
