console.log("client.js works so far");
const socket = io();

let roomID = null;

function makeGame() {
    socket.emit('makeGame');
}

function joinGame() {
    roomID = document.getElementById('roomID').value;
    socket.emit('joinGame', { roomID });
}

function getRoomLink() {
    socket.emit('getRoomLink');
}

socket.on('roomCreated', (roomId) => {
    console.log(`Room created with ID: ${roomId}`);
    // You can now share the room ID with others
    const roomUrl = window.location.origin + '/?roomId=' + roomId;
    console.log('Room URL:', roomUrl);

    // Automatically get and display the room link
    getRoomLink();
});
socket.on('roomLink', (data) => {
    const roomUrl = window.location.origin + '/?roomId=' + data.roomID;
    console.log('Room Link:', roomUrl);
    // Now you can share the room link with another player
});

socket.on("newGame", (data) => {
    roomID = data.roomID;
    document.getElementsByClassName("home-ui")[0].style.display = "none";
    document.getElementsByClassName("Main-phase")[0].style.display = "block";
});

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    if (roomId) {
        socket.emit('joinGame', roomId);
    }
});
