const card1 = document.querySelector('.card1')
const card2 = document.querySelector('.card2')
// const suits = ["D","S","H","C"];
var time = 1;
var interval = setInterval(function() {
    if (time <= 3) {
            card1.src = "/client//cards/" + Math.floor(Math.random()*3 + 11) + suits[Math.floor(Math.random()*4)]+ ".svg"
            card2.src = "/client/cards/" + Math.floor(Math.random()*3 + 11) + suits[Math.floor(Math.random()*4)]+ ".svg"
        }
        else {
            clearInterval(interval);
        }
    }, 3000);

document.addEventListener('DOMContentLoaded', () => {
    const selectedBackground = localStorage.getItem("background");
    if (selectedBackground) {
        updateBg(selectedBackground)
    }

    // Add ifSavedBackgroundMusic Volume

});

var customBgStyle = document.querySelector('.custom-bg-style');
loadCustomBgs()

const cardStyleOptions = document.querySelectorAll(".card-style-option")
for(cardStyleOption of cardStyleOptions){
    request.open("GET", "/client/cards/1" + suits[Math.floor(Math.random() * suits.length)] + ".svg", false);
    request.send(null);
    cardStyleOption.innerHTML = request.responseText;
}