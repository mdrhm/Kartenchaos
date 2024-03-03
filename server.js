const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname)));

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, 'client')));

// Health check endpoint
app.get('/healthcheck', (req, res) => {
    res.send('<h1>RPS App running...</h1>');
});

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

// Store the rooms and their details
const rooms = {};

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

io.on('connection', (socket) => {
    console.log('a user has connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('makeGame', () => {
        const roomID = makeid(6);
        rooms[roomID] = {};
        socket.join(roomID);
        socket.emit('newGame', { roomID });
    });

    socket.on('joinGame', (data) => {
        const roomId = data.roomID;
        if (rooms[roomId] !== undefined) {
            socket.join(roomId);
            io.to(roomId).emit('2playersareconnected', {});
            socket.emit('2playersconnected');
        } else {
            socket.emit('roomNotFound');
        }
    });

    socket.on('getRoomLink', () => {
        // Send the room ID back to the client
        const roomID = Object.keys(rooms).find((roomId) => rooms[roomId] && Object.keys(rooms[roomId]).length < 2);
        if (roomID) {
            socket.emit('roomLink', { roomID });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
