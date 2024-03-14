let cards = document.querySelectorAll("#p1handcontainer .card");
const dropleft = document.querySelector("#dropl");
const dropright = document.querySelector("#dropr");

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


var request = new XMLHttpRequest();
for(let i = 0; i < y.length; i++){
    request.open("GET", "/client/cards/" + y[i] + suits[Math.floor(Math.random() * suits.length)] + ".svg", false);
    request.send(null);
    var data = request.responseText;
    // console.log(data)
    cards[i].innerHTML += data.replaceAll("height=\"3.5in\"", "").replaceAll("width=\"2.5in\"","");
    // cardsInner[i].src = "/client/cards/" + y[i] + suits[Math.floor(Math.random() * suits.length)] + ".svg"
}

let selected = null;
for (let i = 0; i < cards.length; i++) {
    if (dropleft.children.length === 0) {
        cards[i].addEventListener("dblclick", () => {
            if (count > 0 || dropleft.children.length > 0) {
                // Set draggable attribute to false
                cards[i].draggable = false;
            } else {
                sendCardChoice(y[i]);
                dropleft.appendChild(cards[i]);
                console.log(cards[i]);
                count = 1;

                cards[i].style.borderRadius = '10px';
                cards[i].style.width = "70%";
                cards[i].style.height = "30vh";
                cards[i].style.marginLeft = "10px";


                // Remove the dblclick event listener after the first double-click
                e.target.removeEventListener("dblclick", arguments.callee);
            }
        });
    } else {
        console.log("You already put a card down dipstick");
    }
}

let countdownTime = 10; // Initial countdown time
let countdownInterval; // Variable to hold the interval

// Function to start the countdown timer
function startTimer() {
  // Synchronize the start time
  const startTime = new Date().getTime() + 12000; // Start time after 5 seconds

  // Start the countdown interval
  countdownInterval = setInterval(() => {
    // Calculate the remaining time
    const currentTime = new Date().getTime();
    const remainingTime = Math.max(0, Math.floor((startTime - currentTime) / 1000));

    // Update the countdown element with the remaining time
    updateCountdown(remainingTime);

    // If the countdown reaches 0, clear the interval
    if (remainingTime === 0) {
      clearInterval(countdownInterval);
      document.getElementById('timer').textContent = "Time's up!";
      goToClashPhase();
    }
  }, 1000);
}

function goToClashPhase() {
    document.getElementsByClassName("home-ui")[0].style.display = "none";
    document.getElementsByClassName("wait-phase")[0].style.display = "none";
    document.querySelector("#Main-phase").style.display = "none";
    document.querySelector("#clash-page").style.display = "block";
  }

// Function to update the countdown element with the given time
function updateCountdown(time) {
  document.getElementById('timer').textContent = time;
}