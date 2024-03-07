console.log("client.js works so far");
const socket = io();

let roomID = null;
let player1 = false;
let cardi = document.createElement('img');
cardi.src = './cards/2B.svg';

let cardi2 = document.createElement('img');



const cardContainer = document.createElement('div');
cardContainer.appendChild(cardi);

function makeGame() {
    player1= true;
    socket.emit('makeGame');
}

function joinGame() {
    roomID = document.getElementById('roomID').value;
    socket.emit('joinGame', { roomID: roomID });
}

function getRoomLink() {
    socket.emit('getRoomLink');
}

window.onload = function () {
    const extractedRoomID = getRoomIDFromURL();

    if (extractedRoomID) {
        // Call joinGame with the extracted room ID
        joinGame(extractedRoomID);
    }
};

function getRoomIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('roomID');
}

function joinGame(roomID) {
    socket.emit('joinGame', { roomID: roomID });
}

function goToMainPhase() {
    // Go to the main phase logic here
    document.getElementsByClassName("home-ui")[0].style.display = "none";
    document.getElementsByClassName("wait-phase")[0].style.display = "none";
    document.getElementsByClassName("Main-phase")[0].style.display = "block";
}

socket.on('roomLink', (data) => {
    const roomCode = window.location.search.substring(1); // Get the URL parameters excluding the '?' character
    document.getElementById("link").innerHTML = roomCode;

    // Now you can share the room link with another player
});

socket.on('newGame', (data) => {
    console.log("making game");
    roomID = data.roomID;

    // Hide the home screen
    document.getElementsByClassName("home-ui")[0].style.display = "none";
    
    document.getElementsByClassName("wait-phase")[0].style.display = "block";
    
    // Update the URL without a full page reload
    const roomUrl = window.location.origin + '/?roomID=' + roomID;
    history.pushState({ roomID: roomID }, 'Room Created', roomUrl);
});
 
socket.on("2playersConnected", () => {
    console.log('2 players connected!');
    goToMainPhase();
});

// Note that cardChosen is not the card element but its ID
function sendCardChoice(cardChosen, player) {
    let choiceEvent;

    if (player === "player1") {
        choiceEvent = "player1placedcard";
    } else {
        choiceEvent = "player2placedcard";
    }

    socket.emit(choiceEvent, {
        cardChosen: cardChosen,
        roomID: roomID
    });
}

socket.on("updatep2withp1card", () => {
    console.log("player1placedcard");
    
    // Check if the current client is player 2
    if (!player1) {
        
        document.getElementById("drop_port").style.display = "none";
        document.getElementById("drop_port2").style.display = "block";
        dropport.appendChild(cardi);
        
    }
    player1 = true;
});


socket.on("updatep1withp2card", () => {
    console.log("player2placedcard");
    
    // Check if the current client is player 1
    if (player1) {
        document.getElementById("drop_port2").style.display = "none";
        document.getElementById("drop_port").style.display = "block";
        dropport2.appendChild(cardi);
    }
    player1 = false;
});


