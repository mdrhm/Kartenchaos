let cards = document.querySelectorAll("#p1handcontainer .card");
const dropleft = document.querySelector("#dropl");
const dropright = document.querySelector("#dropr");

// const allBtn = document.querySelectorAll('.button');
// const audioPlayer = document.getElementById('audioPlayer');
// allBtn.forEach(btn => {
//     btn.addEventListener('click', () => {
//         audioPlayer.play();
//     });
// });

// console.log("Script loaded");

// const allBtn = document.querySelectorAll('.button');
// const audioPlayer = document.getElementById('audioPlayer');

// console.log("Buttons:", allBtn);
// console.log("Audio Player:", audioPlayer);

// allBtn.forEach(btn => {
//     btn.addEventListener('click', () => {
//         console.log("Button clicked");
//         audioPlayer.play();
//     });
// });


let count = 0;
let min = 25;
let max = 35;
const cardsInner = document.querySelectorAll(".card-inner");
const suits = ["D","H","S","C"]

function generateHand(sum) {
// Initialize an array with five cells
    let cells = [0, 0, 0, 0, 0];

// Distribute the sum among the cells
    for (let i = 0; i < 4; i++) {
        // Generate a random number between 1 and the remaining sum or 10, whichever is smaller
        let randomValue = Math.min(Math.floor(Math.random() * (sum - (4 - i))) + 1, 10);

        // Assign the random value to the current cell
        cells[i] = randomValue + suits[Math.floor(Math.random() * suits.length)];

        // Deduct the assigned value from the remaining sum
        sum -= randomValue;
    }

// Assign the remaining sum to the last cell, ensuring it doesn't exceed 10
    cells[4] = Math.min(sum, 10) + suits[Math.floor(Math.random() * suits.length)];
    currplayerhand = cells;
    return cells;
}
function getRandominRange(min, max) {
    return parseInt(Math.random() * (max - min)) + min;
}


// let x = getRandominRange(25,35);
// let x = 30;
// let y= generateHand(x);

function loadCards(hand) {
    for (let i = 0; i < hand.length; i++) {
        cards[i].classList.remove("hidden")
        cards[i].innerHTML = getCard(hand[i], "curr")
    }
}

let selected = null;
for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("dblclick", () => {
        if (dropleft.children.length === 0) {
            if (dropleft.children.length > 0) {
                // Set draggable attribute to false
                cards[i].draggable = false;
            } else {
                sendCardChoice(currplayerhand[i]);
                cards[i].children[0].style.borderRadius = '10px';
                cards[i].children[0].style.width = "70%";
                cards[i].children[0].style.height = "30vh";
                cards[i].children[0].style.marginLeft = "10px";
                dropleft.appendChild(cards[i].children[0]);
                cards[i].classList.add("hidden");

                // Remove the dblclick event listener after the first double-click
            }
        } else {
            console.log("You already put a card down dipstick");
        }
    })
}

function getCard(card, tag){
    let suit = card.at(-1)
    var request = new XMLHttpRequest();
    request.open("GET", "/client/cards/" + card + ".svg", false);
    request.send(null);
    return request.responseText.replaceAll("height=\"3.5in\"", "").replaceAll("width=\"2.5in\"","").replaceAll("V" + suit, tag + "-V" + suit).replaceAll("S" + suit, tag + "-S" + suit);
}