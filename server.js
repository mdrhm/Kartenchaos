const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
// Store the rooms and their details
const rooms = {};
let player1Played = false, player2Played = false;


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname)));

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, 'client')));



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

    socket.on('disconnecting', () => {
        console.log('user disconnected');
        let rID = ((Object.entries(rooms)).filter((room) => room[1].player1 === socket.id || room[1].player2 === socket.id)[0])
        if(rID){
            rID = rID.toString().split(",")[0]
            socket.broadcast.in(rID).emit("errorDialogue", {text: "Your opponent has disconnected"});
            delete rooms[rID]
        }
    });
    // socket.on('disconnecting', () => {
    //
    // });
    socket.on('makeGame', (data) => {
        console.log("making game");
        const roomID = makeid(6);
        rooms[roomID] = {roomID: roomID, player1: socket.id, p1cardstyle: data.cardstyle, p1hand: data.hand};
        if(data.status){
            rooms[roomID].status = data.status
        }
        console.log(rooms);
        socket.join(roomID);
        socket.emit('newGame', rooms[roomID]);
    });

    socket.on('joinGame', (data) => {
        if (rooms[data.roomID]) {
            console.log("joininggame");
            console.log(data);
            console.log("joingame" + data.roomID);
            if (!rooms[data.roomID].player2) {
                socket.join(data.roomID);
                rooms[data.roomID].player2 = socket.id;
                rooms[data.roomID].p2cardstyle = data.cardstyle
                rooms[data.roomID].p2hand = data.hand
                io.to(data.roomID).emit('loadCardStyles', rooms[data.roomID]);
                io.to(data.roomID).emit("2playersConnected", { roomID: data.roomID });
                delete rooms[data.roomID].status
            }
            else {
                socket.emit("errorDialogue", {text: "This room is full"})

            }
        }
        else{
            socket.emit("errorDialogue", {text: "This room doesn't exist"})
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
            rooms[data.roomID].p1hand.splice(rooms[data.roomID].p1hand.indexOf(cardChosen), 1);
            console.log(rooms)
            console.log("Hand 1 Size: " + (rooms[data.roomID].p1hand.length === 0))
            io.to(data.roomID).emit("updatep2withp1card", {cardChosen : data.cardChosen});
            player1Played = true;
            if(player2Played){
                io.to(data.roomID).emit("stopTimer", rooms[data.roomID]);
                player1Played = false;
                player2Played = false;
            }
            if (rooms[data.roomID].p1hand.length === 0 && rooms[data.roomID].p2hand.length === 0) {
                io.to(data.roomID).emit("getNewHands", rooms[data.roomID]);
            }
        } else {
            console.error(`Room ${data.roomID} does not exist.`);
        }
        console.log(rooms)

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
            rooms[data.roomID].p2hand.splice(rooms[data.roomID].p2hand.indexOf(cardChosen), 1);
            io.to(data.roomID).emit("updatep1withp2card", {cardChosen: data.cardChosen});
            player2Played = true;
            if(player1Played){
                io.to(data.roomID).emit("stopTimer", rooms[data.roomID]);
                player1Played = false;
                player2Played = false;
            }
            if (rooms[data.roomID].p1hand.length === 0 && rooms[data.roomID].p2hand.length === 0) {
                io.to(data.roomID).emit("getNewHands", rooms[data.roomID]);
            } else {
                console.error(`Room ${data.roomID} does not exist.`);
            }
        }
        console.log(rooms)

    });
    socket.on("updatePlayer1Hand", (data) => {
        rooms[data.roomID].p1hand = data.p1hand;
    })
    socket.on("updatePlayer2Hand", (data) => {
        rooms[data.roomID].p2hand = data.p2hand;
    })
    socket.on("updateCardStyleForAll", (data) => {
        if(rooms[data.roomID]) {
            if (socket.id === rooms[data.roomID].player1) {
                rooms[data.roomID].p1cardstyle = data.style;
            } else if (socket.id === rooms[data.roomID].player2) {
                rooms[data.roomID].p2cardstyle = data.style;
            }
            io.to(data.roomID).emit('loadCardStyles', rooms[data.roomID]);
        }
    })
    socket.on("lookingForGame", (data) => {
        let rID = Object.entries(rooms).filter((rooms) => rooms[1].status === 'Looking For Opponent')[0]
        if(rID) {
            rID = rID.toString().split(",")[0]
        }
        socket.emit("gameFound", {roomID: rID})
    })
    socket.on("sendMessage", (data) => {
        io.to(data.roomID).emit("updateChat", {code: "send", player: data.player, message: data.message})
    })
});
server.listen(3000, () => {
    console.log('listening on *:3000');
})