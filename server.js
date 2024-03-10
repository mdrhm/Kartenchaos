const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
// Store the rooms and their details
const rooms = {};



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



function makeid(length) {
    console.log("making id");
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
        console.log("making game");
        const roomID = makeid(6);
        rooms[roomID] = { player1: socket.id };
        console.log(roomID);
        socket.join(roomID);
        socket.emit('newGame', { roomID: roomID });
    });
    
    
    

    socket.on('joinGame', (data) => {
    if (rooms[data.roomID] != null) {
        console.log("joininggame");
        console.log(data);
        console.log("joingame" + data.roomID);
        
        socket.join(data.roomID);
        io.to(data.roomID).emit("2playersConnected", { roomID: data.roomID });
        io.to(socket.id).emit("2playersConnected", { roomID: data.roomID });
    }
});

    socket.on('getRoomLink', () => {
        // Send the room ID back to the client
        console.log("gettingroomlink");
        const roomID = Object.keys(rooms).find((roomId) => rooms[roomId] && Object.keys(rooms[roomId]).length < 2);
        if (roomID) {
            socket.emit('roomLink', { roomID });
        }
    });



    socket.on("player1Choice", (data) => {
        let cardChosen = data.cardChosen;
        console.log("player1choicecalled");
        console.log(rooms);
        if (rooms[data.roomID]) {
            rooms[data.roomID].player1Choice = cardChosen;
            io.to(data.roomID).emit("updatep2withp1card", {cardChosen : data.cardChosen});
        } else {
            console.error(`Room ${data.roomID} does not exist.`);
        }
    });

    socket.on("player2Choice", (data) => {
        let cardChosen = data.cardChosen;
        let roomID = data.roomID;
        console.log("p2 room id check " + roomID);
        console.log("player2choicecalled");
        console.log("Received data:", data);
        console.log("rooms data" + rooms[data]);
        if (rooms[data.roomID]) {
            rooms[data.roomID].player2Choice = cardChosen;
            io.to(data.roomID).emit("updatep1withp2card", {cardChosen : data.cardChosen});
        } else {
            console.error(`Room ${data.roomID} does not exist.`);
        }
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
})