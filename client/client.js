console.log("client.js works so far");
const socket = io();

let roomID = null;
let player1 = false;
let cardi = document.createElement('img');
cardi.src = './cards/2B.svg';
cardi.style.boxShadow = '-2.5px -2.5px 2.5px #0F0F0F';
cardi.style.borderRadius = '10px';
cardi.style.width = "70%";
cardi.style.height = "30vh";
cardi.style.marginLeft = "10px";


function makeGame() {
    player1= true;
    socket.emit('makeGame');
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

function joinGame() {
    console.log("joingame room id" + roomID);
    socket.emit('joinGame', { roomID: roomID });
    roomID = getRoomIDFromURL();
    socket.emit('joinGame', {roomID: roomID});
}


function goToMainPhase() {
    // Go to the main phase logic here
    document.getElementsByClassName("home-ui")[0].style.display = "none";
    document.getElementsByClassName("wait-phase")[0].style.display = "none";
    document.querySelector("#Main-phase")[0].style.display = "block";
}


socket.on('newGame', (data) => {
    console.log("making game");
    roomID = data.roomID;
    console.log(roomID);
    // Hide the home screen
    document.getElementsByClassName("home-ui")[0].style.display = "none";
    
    document.getElementsByClassName("wait-phase")[0].style.display = "block";
    
    // Update the URL without a full page reload
    const roomUrl = window.location.origin + '/?roomID=' + roomID;
    history.pushState({ roomID: roomID }, 'Room Created', roomUrl);
});
 
socket.on("2playersConnected", () => {
    console.log('2 players connected!');
    console.log(roomID);
    goToMainPhase();
});

// Note that cardChosen is not the card element but its ID
function sendCardChoice(cardChosen) {
    let choiceEvent;
    console.log("beginning choiceevent");
    console.log(roomID);
    if (player1){
        choiceEvent = "player1Choice";
        console.log("its player1 choice");
    }
    else {
        choiceEvent = "player2Choice";
        console.log("its player2 choice");
    }
    console.log("send card choice no romm id" + roomID);
    socket.emit(choiceEvent, {
    cardChosen: cardChosen,
        roomID: roomID
    });
}

socket.on("updatep2withp1card", (data) => {
    if(!player1){
        console.log("player1placedcard");
        let card = data.cardChosen;
         if (dropright) {
            dropright.appendChild(cardi);
        } 
        else {
            console.log("Element with id 'dropright' not found.");
        }

    }
});


socket.on("updatep1withp2card", (data) => {
    console.log(player1);
    console.log("player2placedcard before check");
    if(player1){
        console.log("player2placedcard");
        let card = data.cardChosen;
        if (dropright) {
            dropright.appendChild(cardi);
        } else {
            console.log("Element with id 'dropright' not found.");
        }
    }
});


