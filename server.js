const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Enable CORS for cross-origin requests
app.use(cors());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'client')));

// API route for testing the backend
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// Real-time communication with Socket.IO
let messages = [];  // Store chat messages
let users = [];  // Store connected users

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send existing messages to the new user
    socket.emit('previousMessages', messages);

    // Handle user joining
    socket.on('join', (username) => {
        users.push({ username, socketId: socket.id });
        io.emit('userJoined', `${username} has joined the chat!`);
    });

    // Handle chat message
    socket.on('sendMessage', (message) => {
        messages.push(message);
        io.emit('receiveMessage', message);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        const user = users.find(u => u.socketId === socket.id);
        if (user) {
            users = users.filter(u => u.socketId !== socket.id);
            io.emit('userLeft', `${user.username} has left the chat.`);
        }
        console.log('A user disconnected');
    });
});

// Serve frontend (index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Set the port (render or local environment)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
