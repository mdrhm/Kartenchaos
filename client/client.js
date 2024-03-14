console.log("client.js works so far");
const socket = io();

let roomID = null;
let player1 = false;
let cardi = document.createElement('div');
var request = new XMLHttpRequest();
request.open("GET", "/client/cards/2B.svg", false);
request.send(null);
cardi.innerHTML = request.responseText.replaceAll("height=\"3.5in\"", "").replaceAll("width=\"2.5in\"","");
cardi.style.borderRadius = '10px';
cardi.style.width = "70%";
cardi.style.height = "30vh";
cardi.style.marginLeft = "10px";


function makeGame() {
    player1= true;
    socket.emit('makeGame', {cardstyle: localStorage.getItem("cardstyle")});
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

// Copy Link to Clipboard from button
function copyLinkToClipboard() {
    var link = window.location.href;
    navigator.clipboard.writeText(link).then(function() {
        console.log('Link copied to clipboard!');
        showNotification('Link copied to clipboard!');
    }, function(err) {
        console.error('Failed to copy link: ', err);
    });
}

function showNotification(message) {
    var notification = document.getElementById('clipboard-notification');
    notification.innerText = message;
    notification.style.display = 'block';
    setTimeout(function() {
        notification.style.display = 'none';
    }, 3000); // Hide notification after 3 seconds
}

function joinGame() {
    console.log("joingame room id" + roomID);
    socket.emit('joinGame', { roomID: roomID, cardstyle: localStorage.getItem("cardstyle") });
    roomID = getRoomIDFromURL();
    socket.emit('joinGame', {roomID: roomID, cardstyle: localStorage.getItem("cardstyle")});
}
function goToMainPhase() {
    // Go to the main phase logic here
    document.getElementsByClassName("home-ui")[0].style.display = "none";
    document.getElementsByClassName("wait-phase")[0].style.display = "none";
    document.querySelector("#Main-phase").style.display = "flex";
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
            document.querySelectorAll(".opp-card")[0].remove();
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
            document.querySelectorAll(".opp-card")[0].remove();
        } else {
            console.log("Element with id 'dropright' not found.");
        }
    }
});

socket.on('loadCardStyles', (data) => {
    if(localStorage.getItem("cardstyle") === data.style1){
        document.querySelector("#p2handcontainer").classList = data.style2;
    }
    else{
        document.querySelector("#p2handcontainer").classList = data.style1;

    }
})