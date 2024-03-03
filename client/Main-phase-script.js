

let cards = document.getElementsByClassName("card");
let dropport = document.getElementById("drop_port");
let count = 0;
let min = 25;
let max = 35;
const cardsInner = document.querySelectorAll(".card-inner");
const suits = ["D","H","S","C"]

function generateHand(sum) {
// Initialize an array with 5 cells
// Initialize an array with 5 cells
let cells = [0, 0, 0, 0, 0];

// Distribute the sum among the cells
for (let i = 0; i < 4; i++) {
    // Generate a random number between 1 and the remaining sum or 10, whichever is smaller
    let randomValue = Math.min(Math.floor(Math.random() * (sum - (4 - i))) + 1, 10);

    // Assign the random value to the current cell
    cells[i] = randomValue;

    // Deduct the assigned value from the remaining sum
    sum -= randomValue;
}

// Assign the remaining sum to the last cell, ensuring it doesn't exceed 10
cells[4] = Math.min(sum, 10);

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


for(let i = 0; i < y.length; i++){
    cardsInner[i].src = "./cards/" + y[i] + suits[Math.floor(Math.random() * suits.length)] + ".svg"
}



function loadCards(){

}
/*





Goes through cards and checks which card has been clicked and is being dragged.

Then it addes that card to the dropport where it is formatted to fit in the space.

*/



let selected = null;


for (let card of cards) {
    if (dropport.children.length === 0) {
        card.addEventListener("dblclick", function (e) {
            if (count > 0 || dropport.children.length > 0) {
                // Set draggable attribute to false
                e.target.draggable = false;
            } else {
                dropport.appendChild(e.target);
                count = 1;

                e.target.src = "cards/2B.svg";
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




