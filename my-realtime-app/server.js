const express = require('express');
const http = require('http');
const mysql = require('mysql');
const socketIo = require('socket.io');

// Initialize express and create a server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Setup the database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'ShantelNgwenzane',
    password: 'ShaanN',
    database: 'My-database'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// Serve static files from 'public' directory
app.use(express.static('public'));

// WebSocket connection event
io.on('connection', socket => {
    console.log('New client connected');

    // Listen for status updates from clients
    socket.on('new_status', status => {
        // Insert the new status into the database
        const query = 'INSERT INTO statuses (status) VALUES (?)';
        db.query(query, [status], (err, result) => {
            if (err) throw err;
            // Broadcast the new status to all clients
            io.emit('update_status', { id: result.insertId, status, created_at: new Date() });
        });
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
