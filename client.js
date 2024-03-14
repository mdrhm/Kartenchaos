console.log("client.js works so far");
const socket = io();

let roomID = null;
let player1 = false;
let cardi = document.createElement('img');
cardi.src = './cards/2B.svg';

let cardi2 = document.createElement('img');
const card1container = document.getElementsByClassName("card1container");
const card2container = document.getElementsByClassName("cardc2ontainer");
cardi2.style.boxShadow = '-2.5px -2.5px 2.5px #0F0F0F';
cardi2.style.borderRadius = '10px';
cardi2.style.width = "32.5%";
cardi2.style.height = "30vh";
cardi2.style.marginLeft = "30px";
let p1card;
let p2card;
let valsum;
let greater;

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
    p1card = data.cardChosen;
    dropport.appendChild(cardi);
});

socket.on("updatep1withp2card", (data) => {
    console.log("player2placedcard");
    p2card = data.cardChosen;
    dropport.appendChild(cardi);
});

function goToClashPhase() {
    // Go to the main phase logic here
    document.getElementsByClassName("home-ui")[0].style.display = "none";
    document.getElementsByClassName("wait-phase")[0].style.display = "none";
    document.querySelector("#Main-phase")[0].style.display = "none";
    document.getElementsByClassName("clash-phase")[0].style.display = "block";
    card1container.appendChild("cardi");
    card2container.appendChild("cardi");

}

document.addEventListener("DOMContentLoaded", function () {
    // Get the cards
    var card1 = document.querySelector('.card1clash');
    var card2 = document.querySelector('.card2clash');

    // Add an event listener for the animationend event
    card1.addEventListener('animationend', handleAnimationEnd);
    card2.addEventListener('animationend', handleAnimationEnd);

    // Trigger the flip by adding the 'flipped' class
    card1.classList.add('flipped');
    card2.classList.add('flipped');

    function handleAnimationEnd(event) {
      if (event.target.classList.contains('flipped')) {
        
        console.log("Flip animation ended. Now you can change properties.");
        card1container.replaceChild(p1, cardi);
        card2container.replaceChild(p2, cardi);
      }
    }
  });

function compareVal(p1card, p2card) {
    let p1cardval = parseInt(p1card.id);
    let p2cardval = parseInt(p2card.id);
    if (p1cardval > p2cardval) {
        valsum = p1cardval+p2cardval;
        //turn the V twoards p1
    }
    else if (p1cardval < p2cardval) {
        valsum = p1cardval+p2cardval;
        //turn the V twoards p2
    }

    else {
      //  
    }


document.addEventListener("DOMContentLoaded", function () {
  const breakableCard = document.getElementById("breakableCard");

  // Function to trigger the animation
  function triggerAnimation() {
    // Reset the animation by removing and re-adding the 'break' class
    breakableCard.classList.remove("break");
    setTimeout(() => {
      breakableCard.classList.add("break");
    }, 100); // Adjust the delay as needed
  }

  // Initial trigger after the page loads (optional)
  setTimeout(() => {
    triggerAnimation();
  }, 1000); // Adjust the delay as needed
});


}



