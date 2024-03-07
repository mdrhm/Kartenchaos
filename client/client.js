console.log("client.js works so far");
const socket = io();

let roomID = null;
let player1 = false;
let cardi = document.createElement('img');
cardi.src = './cards/2B.svg';

let cardi2 = document.createElement('img');

cardi2.style.boxShadow = '-2.5px -2.5px 2.5px #0F0F0F';
cardi2.style.borderRadius = '10px';
cardi2.style.width = "32.5%";
cardi2.style.height = "30vh";
cardi2.style.marginLeft = "30px";

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
    document.querySelector("#Main-phase")[0].style.display = "block";
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

//Note that cardChosen is not the card element but its ID
function sendCardChoice(cardChosen){
    const choiceEvent = player1 ? "player1Choice" : "player2Choice";
    socket.emit(choiceEvent, {
        cardChosen: cardChosen,
        roomID: roomID
    });

}

socket.on("updatep2withp1card", (data) => {
    console.log("player1placedcard");
    dropport.appendChild(cardi);
});

socket.on("updatep1withp2card", (data) => {
    console.log("player2placedcard");
    dropport.appendChild(cardi);
});



