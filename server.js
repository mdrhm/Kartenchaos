const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
const cheerio = require('cheerio');
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
            socket.emit("errorDialogue", {text: "This room <br> doesn't exist"})
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
        let rID = Object.entries(rooms).filter((rooms) => rooms[1].status === 'Looking For Opponent' && !rooms[1].player2)[0]
        if(rID) {
            rID = rID.toString().split(",")[0]
        }
        socket.emit("gameFound", {roomID: rID})
    })
    socket.on("sendMessage", (data) => {
        io.to(data.roomID).emit("updateChat", {code: "send", player: data.player, message: data.message})
    })
    socket.on("spotify_api_call", (data) => {
        const token = new URLSearchParams();
        token.append('grant_type', 'client_credentials');
        token.append('client_id',  process.env.SPOTIFY_API_ID);
        token.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET);

        axios.post('https://accounts.spotify.com/api/token', token, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => {
                axios.get(`https://api.spotify.com/v1/search?q=${data.song}&type=track`, {
                    headers: {
                        'Authorization': `Bearer ${response.data.access_token}`
                    }
                })
                    .then(response => {
                        let songs = [];
                        let responseData = response.data.tracks.items;
                        for(let i = 0; i < responseData.length; i++){
                            songs[i] = {
                                img: (responseData[i].album.images[0].url) ? responseData[i].album.images[0].url: "/client/Images/settings.svg",
                                name: responseData[i].name,
                                artist: responseData[i].artists.map(artist => artist.name).join("; "),
                                url: responseData[i]["external_urls"]["spotify"]
                            }
                        }
                        socket.emit("spotify_api_response", (songs.length > 0) ? {songs: songs} : {error: "Looks like we don't know that one"})
                    })
                    .catch(error => {
                        socket.emit("spotify_api_response", {error: "Looks like we don't know that one"})
                    });

            })
            .catch(error => {
                socket.emit("spotify_api_response", {error: "Sorry. An error has occurred"})
            });
    })
    socket.on("youtube_api_call", (data) => {
        console.log(`https://www.youtube.com/results?search_query=%22${data.artist.split(';')[0]}+-+topic%22+${data.name}`)
        axios.get(`https://www.youtube.com/results?search_query=%22${data.artist.split(';')[0]}+-+topic%22+${data.name}`)
            .then((response) => {
                if(response.status === 200) {
                    const html = response.data;
                    let videoId = html.split("</script>").filter((h) => {return h.includes("var ytInitialData")})[0].split('"videoId":"')[1].split('"')[0]
                    if(videoId) {
                        socket.emit("youtube_api_response", {name: data.name, artist: data.artist, img: data.img, videoId: videoId})
                    }
                }
            }, (error) => console.log(error) );
    })
});
server.listen(3000, () => {
    console.log('listening on *:3000');
})