const card1 = document.querySelector('.card1')
const card2 = document.querySelector('.card2')
// const suits = ["D","S","H","C"];
var time = 1;
var interval = setInterval(function() {
    if (time <= 3) {
        card1.src = "/client/cards/" + Math.floor(Math.random()*3 + 11) + suits[Math.floor(Math.random()*4)]+ ".svg"
        card2.src = "/client/cards/" + Math.floor(Math.random()*3 + 11) + suits[Math.floor(Math.random()*4)]+ ".svg"
    }
    else {
        clearInterval(interval);
    }
}, 3000);

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem("background")) {
        updateBg(localStorage.getItem("background"))
    }
    else{
        updateBg("bg-0")
    }
    if (localStorage.getItem("cardstyle")) {
        updateCardStyle(localStorage.getItem("cardstyle"))
    }
    else {
        updateCardStyle("default")
    }
    const savedMusicOption = parseInt(localStorage.getItem("musicOption"));
    const options = document.querySelectorAll('.menu li');
    if (savedMusicOption) {
        const audioElement = document.getElementById("music");
        audioElement.src = "Audio/" + options[savedMusicOption].innerHTML + ".mp3";
        audioElement.load();
        audioElement.play();
        document.querySelector(".selected").innerHTML = options[savedMusicOption].innerHTML
        options[savedMusicOption].classList.add("hidden")
    }
});

var customBgStyle = document.querySelector('.custom-bg-style');
loadCustomBgs()

const cardStyleOptions = document.querySelectorAll(".card-style-option")
for(let i = 0; i < cardStyleOptions.length; i++){
    cardStyleOptions[i].innerHTML = getCard("1" + suits[i%4], i)
}

function loadOppCards() {
    for (let i = 0; i < 5; i++) {
        document.querySelectorAll(".opp-card")[i].classList.remove("hidden")
        document.querySelectorAll(".opp-card")[i].innerHTML = getCard("2B", "opp")
    }
}

let playGameOptions = document.querySelectorAll("#play-game-options-inner button")
let playGameTranslate = 0;

document.querySelector("#play-game").addEventListener("click", () => {
    document.querySelector("#play-game").classList.add("hidden")
    document.querySelector("#play-game-options").classList.remove("hidden")
})
document.querySelector("#play-game-prev").addEventListener("click", () => {
    playGameTranslate = Math.min(playGameTranslate + 650, 0)
    if(playGameTranslate === 0){
        document.querySelector("#play-game-prev").classList.add("invisible")
    }
    document.querySelector("#play-game-next").classList.remove("invisible")
    playGameOptions.forEach((playGameOption) => {
        playGameOption.style.transform = `translateX(-${playGameTranslate}px)`
    })
})

document.querySelector("#play-game-next").addEventListener("click", () => {
    playGameTranslate = Math.max(playGameTranslate - 650, (playGameOptions.length - 1) * -650)
    if(playGameTranslate === (playGameOptions.length - 1) * -650){
        document.querySelector("#play-game-next").classList.add("invisible")
    }
    document.querySelector("#play-game-prev").classList.remove("invisible")
    playGameOptions.forEach((playGameOption) => {
        playGameOption.style.transform = `translateX(${playGameTranslate}px)`
    })
})