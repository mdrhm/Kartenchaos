

let cards = document.getElementsByClassName("card");
let dropport = document.getElementById("drop_port");
let count = 0;
let min = 25;
let max = 35;

function get5RandomCards(sum) {
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
let x = getRandominRange(25,35);
let y= get5RandomCards(x);
let z = 0
for(let i = 0; i < 5; i++){
    z += y[i];
}
console.log(x);
console.log(y);
console.log(z)



function loadCards(){

}
/*





Goes through cards and checks which card has been clicked and is being dragged.

Then it addes that card to the dropport where it is formatted to fit in the space.

*/
for (let card of cards) {
    if (dropport.children.length === 0) {
        card.addEventListener("dragstart", function (e) {
            if (count > 0) {
                // Set draggable attribute to false
                card.draggable = false;
            } else {
                let selected = e.target;

                dropport.addEventListener("dragover", function (e) {
                    e.preventDefault();
                });

                dropport.addEventListener("drop", function (e) {
                    dropport.appendChild(selected);
                    count = 1;

                   
                    selected.src = "cards/2B.svg";
                    selected.style.boxShadow = '-2.5px -2.5px 2.5px #0F0F0F';
                    selected.style.borderRadius = '10px';
                    selected.style.width = "32.5%";
                    selected.style.height = "30vh";
                    selected.style.marginLeft = "30px";

                    selected = null;
                });
            }
        });
    } else {
        console.log("You already put a card down dipstick");
    }
}



