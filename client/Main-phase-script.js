let cards = document.getElementsByClassName("card");
let dropport = document.getElementById("drop_port");
let count = 0;
let min = 25;
let max = 35;
const cardsInner = document.querySelectorAll(".play-card");
const suits = ["D","H","S","C"]

function generateHand() {
    let sum = 30;
    let cells = [];

    for (let i = 0; i < 4; i++) {
        let randomValue = Math.min(Math.floor(Math.random() * (sum - (4 - i))) + 1, 10);
        cells.push(randomValue);
        sum -= randomValue;
    }

    cells.push(Math.min(sum, 10));
    return cells;
}

function getRandominRange(min, max) {
    return parseInt(Math.random() * (max - min)) + min;
}


// let x = getRandominRange(25,35);
let x = 30;
let y= generateHand(x);
let z = 0
for(let i = 0; i < 5; i++){
    z += y[i];
}

var request = new XMLHttpRequest();
for (let i = 0; i < y.length; i++) {
    let cardValue = y[i] + suits[Math.floor(Math.random() * suits.length)];
    request.open("GET", `/client/cards/${cardValue}.svg`, false);
    request.send(null);
    let data = request.responseText;
    cardsInner[i].innerHTML += data;
}

let selected = null;


for (let card of cards) {
    if (dropport.children.length === 0) {
        card.addEventListener("dblclick", function (e) {
            if (count > 0 || dropport.children.length > 0) {
                // Set draggable attribute to false
                e.target.draggable = false;
            } else {
                sendCardChoice(card);
                dropport.appendChild(e.target);
                count = 1;

                e.target.src = "./cards/2B.svg";
                e.target.style.boxShadow = '-2.5px -2.5px 2.5px #0F0F0F';
                e.target.style.borderRadius = '10px';
                e.target.style.width = "32.5%";
                e.target.style.height = "30vh";
                e.target.style.marginLeft = "30px";

                // Remove the dblclick event listener after the first double-click
                e.target.removeEventListener("dblclick", arguments.callee);
            }
        });
    } else {
        console.log("You already put a card down dipstick");
    }
}