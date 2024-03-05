console.log("client.js works so far");
const socket = io();

let roomID = null;

function makeGame() {
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
    } else {
        // No room ID found, go directly to the main phase
        goToMainPhase();
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
