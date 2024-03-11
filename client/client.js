const socket = io();
let roomID = null;
let player1 = false;
let cardElements = []; // Array to store card elements

function makeGame() {
    player1 = true;
    socket.emit('makeGame');
}

window.onload = function () {
    const extractedRoomID = getRoomIDFromURL();
    if (extractedRoomID) {
        joinGame(extractedRoomID);
    }
    createCardElements(); // Create card elements initially
};

function getRoomIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('roomID');
}

function joinGame() {
    console.log("joining game room id " + roomID);
    roomID = getRoomIDFromURL();
    socket.emit('joinGame', { roomID: roomID });
}

function goToMainPhase() {
    document.getElementsByClassName("home-ui")[0].style.display = "none";
    document.getElementsByClassName("wait-phase")[0].style.display = "none";
    document.querySelector("#Main-phase").style.display = "block";
}

socket.on('newGame', (data) => {
    roomID = data.roomID;
    console.log(roomID);
    document.getElementsByClassName("home-ui")[0].style.display = "none";
    document.getElementsByClassName("wait-phase")[0].style.display = "block";
    const roomUrl = window.location.origin + '/?roomID=' + roomID;
    history.pushState({ roomID: roomID }, 'Room Created', roomUrl);
});

socket.on("2playersConnected", (data) => {
    console.log('2 players connected!');
    console.log(roomID);
    goToMainPhase();
    // Update card elements with card images
    updateCardElements(data.player1Cards);
});

function createCardElements() {
    const handContainer = document.querySelector(".p1handcontainer");
    for (let i = 0; i < 5; i++) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("play-card");
        cardElement.style.setProperty("--i", i - 2);
        const cardImage = document.createElement("img");
        cardImage.classList.add("card-inner");
        cardElement.appendChild(cardImage);
        handContainer.appendChild(cardElement);
        cardElements.push(cardElement);
    }
}

function updateCardElements(cards) {
    for (let i = 0; i < cardElements.length; i++) {
        const cardElement = cardElements[i];
        const cardImage = cardElement.querySelector(".card-inner");
        cardImage.src = `/cards/${cards[i]}.svg`;
    }
}

function sendCardChoice(card) {
    let choiceEvent;
    console.log("beginning choiceevent");
    console.log(roomID);
    if (player1) {
        choiceEvent = "player1Choice";
        console.log("its player1 choice");
    } else {
        choiceEvent = "player2Choice";
        console.log("its player2 choice");
    }
    console.log("send card choice no room id" + roomID);
    socket.emit(choiceEvent, { cardChosen: card, roomID: roomID });
}

socket.on("updatep2withp1card", (data) => {
    if (!player1) {
        console.log("player1placedcard");
        let card = data.cardChosen;
        let dropright = document.getElementById("drop_port");
        if (dropright) {
            dropright.appendChild(cardi);
        } else {
            console.log("Element with id 'dropright' not found.");
        }
    }
});

socket.on("updatep1withp2card", (data) => {
    console.log(player1);
    console.log("player2placedcard before check");
    if (player1) {
        console.log("player2placedcard");
        let card = data.cardChosen;
        let dropright = document.getElementById("drop_port");
        if (dropright) {
            dropright.appendChild(cardi);
        } else {
            console.log("Element with id 'dropright' not found.");
        }
    }
});