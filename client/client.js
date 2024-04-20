console.log("client.js works so far");
const socket = io();

let roomID = null;
let player1 = false;
let currplayerhand, playerhand;
let p1card;
let p2card;

function makeGame(status) {
    player1= true;
    gameOver = false;
    let hand = generateHand(30)
    loadCards(hand)
    loadOppCards()
    socket.emit('makeGame', {cardstyle: localStorage.getItem("cardstyle"), hand: hand, status: status});
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
    return urlParams.get('room');
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
    }, 3000);
}

function joinGame(rID) {
    roomID = rID;
    console.log("joingame room id" + roomID);
    let hand = generateHand(30)
    loadCards(hand)
    loadOppCards()
    socket.emit('joinGame', {roomID: roomID, cardstyle: localStorage.getItem("cardstyle"), hand: hand});
}
function goToMainPhase() {
    // Go to the main phase logic here
    document.getElementsByClassName("home-ui")[0].style.display = "none";
    document.getElementsByClassName("wait-phase")[0].style.display = "none";
    document.querySelector("#Main-phase").style.display = "flex";
    nextRound();
}

socket.on('newGame', (data) => {

    roomID = data.roomID;
    console.log(roomID);
    // Hide the home screen
    document.getElementsByClassName("home-ui")[0].style.display = "none";

    document.getElementsByClassName("wait-phase")[0].style.display = "flex";

    if(!data.status) {
        const roomUrl = window.location.origin + '/?room=' + roomID;
        history.replaceState({roomID: roomID}, 'Room Created', roomUrl);
    }
});

function lookForGame(){
    document.querySelector(".wait-container h1").innerHTML = "Searching For Opponent"
    document.querySelector("#link-button").classList.add("hidden")
    document.querySelector(".wait-phase").style.display = "flex"
    document.querySelector(".home-ui").style.display = "none"
    setTimeout(() => {
        socket.emit("lookingForGame", {})
    }, 1000)
}

function playWithFriend() {
    document.querySelector(".wait-container h1").innerHTML = "Waiting For Opponent"
    document.querySelector("#link-button").classList.remove("hidden")
    makeGame()
}

socket.on("gameFound", (data) => {
    if(data.roomID){
        joinGame(data.roomID)
    }
    else{
        makeGame("Looking For Opponent")
    }
})

socket.on("2playersConnected", () => {
    const roomUrl = window.location.origin + '/?room=' + roomID;
    history.replaceState({ roomID: roomID }, 'Room Created', roomUrl);
    document.querySelector(".chat-header").innerHTML = "Room " + roomID
    goToMainPhase();
    startTimer();

});

// Note that cardChosen is not the card element but its ID
function sendCardChoice(cardChosen) {
    let choiceEvent;

    console.log(roomID);
    if (player1){
        choiceEvent = "player1Choice";

    }
    else {
        choiceEvent = "player2Choice";
        console.log("its player2 choice");
    }

    socket.emit(choiceEvent, {

        cardChosen:cardChosen,

        roomID: roomID,
    });
}

socket.on("updatep2withp1card", (data) => {
    p1card = data.cardChosen;
    console.log(p1card);
    if(!player1){
        console.log(p2card)
        if (dropright) {
            document.querySelector(".dropr-inner-back").innerHTML = getCard("2B", "opp")
            document.querySelectorAll(".opp-card:not(.hidden)")[0].innerHTML = "";
            document.querySelectorAll(".opp-card:not(.hidden)")[0].classList.add("hidden")
        }
        else {
            console.log("Element with id 'dropright' not found.");
        }

    }
});
socket.on("updatep1withp2card", (data) => {
    console.log(player1);
    p2card = data.cardChosen;
    console.log(p2card);
    if(player1){
        p2card = data.cardChosen;
        console.log(p1card)
        if (dropright) {
            document.querySelector(".dropr-inner-back").innerHTML = getCard("2B", "opp")
            document.querySelectorAll(".opp-card:not(.hidden)")[0].innerHTML = "";
            document.querySelectorAll(".opp-card:not(.hidden)")[0].classList.add("hidden")
        } else {
            console.log("Element with id 'dropright' not found.");
        }
    }
});

socket.on('loadCardStyles', (data) => {
    let p1style, p2style
    if(socket.id === data.player1){
        p1style = data.p1cardstyle
        p2style = data.p2cardstyle
    }
    else {
        p1style = data.p2cardstyle
        p2style = data.p1cardstyle
    }
    document.querySelector("#p1handcontainer").classList = p1style;
    document.querySelector("#dropl").classList = p1style;
    document.querySelector("#p2handcontainer").classList = p2style;
    document.querySelector("#dropr").classList = p2style;
})

socket.on('getNewHands', (data) => {
    setTimeout(() => {
        if (socket.id === data.player1) {
            data.p1hand = generateHand(30);
            loadCards(data.p1hand)
            loadOppCards()
            socket.emit("updatePlayer1Hand", data)
        } else {
            data.p2hand = generateHand(30);
            loadCards(data.p2hand)
            loadOppCards()
            socket.emit("updatePlayer2Hand", data)
        }
        console.log("hands changed")
        // socket.emit("newHand", data)
    }, 2000)
})

socket.on('stopTimer', (data) => {
    stopTimer()
    goToClashPhase();
})

function nextRound() {
    if (gameOver) {
        return;
    }
    startTimer()
    document.querySelector("#drop_port").style.transform = "scale(1)";
    document.querySelector("#p1handcontainer").style = "transform: scale(1) translateY(0px); opacity: 1;";
    document.querySelector("#p2handcontainer").style = "transform: scale(1) translateY(0px); opacity: 1";
    document.querySelector(".bar1").style.transform = "scale(1) translate(0%, 0%)";
    document.querySelector(".bar2").style.transform = "scale(1) translate(0%, 0%)";
    document.querySelector("#dropr div").classList.remove("card4")
    dropleft.innerHTML = ""
    document.querySelector(".dropr-inner-front").innerHTML = ""
    document.querySelector(".dropr-inner-back").innerHTML = ""
}

function flipCards(cardid) {
    var sideCard = document.querySelector(".dropr-inner"); // Corrected selector
    document.querySelector(".dropr-inner-front").innerHTML =  getCard(cardid, 'opp');
    sideCard.classList.add("card4");
}

function goToClashPhase() {
    document.getElementsByClassName("home-ui")[0].style.display = "none";
    document.getElementsByClassName("wait-phase")[0].style.display = "none";
    document.querySelector("#drop_port").style.transform = "scale(2)";
    document.querySelector("#p1handcontainer").style = "transform: scale(2) translateY(250px); opacity: 0;";
    document.querySelector("#p2handcontainer").style = "transform: scale(2) translateY(-250px); opacity: 0;";
    document.querySelector(".bar1").style.transform = "scale(1.6) translate(20%, -30%)";
    document.querySelector(".bar2").style.transform = "scale(1.6) translate(-20%, 30%)";
    console.log("player1cards" + p1card, p2card)
    setTimeout(() => {
        if (player1) {
            flipCards(p2card);
            setTimeout(function () {
                calculateHigher(p1card, p2card)
            }, 1000)
        } else {
            flipCards(p1card);
            setTimeout(function () {
                calculateHigher(p2card, p1card)
            }, 1000)
        }
    },500)
    setTimeout(nextRound, 3000)
}

function calculateHigher(card1, card2){
    card1 =  parseInt((card1).replace((card1).at(-1), ""));
    card2 =  parseInt((card2).replace((card2).at(-1), ""));
    if(card1 > card2) {
        damageP2((card1 + card2)/2)
        document.getElementById("V").classList.add("new-position")
        setTimeout(function() {
            document.getElementById("V").classList.add("vleft")
            document.getElementById("V").classList.remove("new-position")
        },  1000);
    }
    else if(card2 > card1){
        damageP1((card2 + card1)/2)
        document.getElementById("V").classList.add("new-position")
        setTimeout(function() {
            document.getElementById("V").classList.add("vright")
            document.getElementById("V").classList.remove("new-position")
        }, 1000);
    }
    else {
        document.getElementById("V").classList.add("new-position")
        setTimeout(function() {
            document.getElementById("V").textContent = "draw"
            document.getElementById("V").style.fontStretch = "expanded"
        }, 600);
    }
}

socket.on("errorDialogue", (data) => {
    document.querySelector("#error").classList.remove("hidden")
    document.querySelector(".error-header").innerHTML = data.text;
    document.querySelector(".home-ui").style.display = "none"
    document.querySelector("#Main-phase").style.display = "none"
})