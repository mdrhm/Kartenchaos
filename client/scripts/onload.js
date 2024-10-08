document.querySelectorAll(".home-pictures-front")[0].innerHTML = getCard("1B", "home")
document.querySelectorAll(".home-pictures-front")[1].innerHTML = getCard("1B", "home")
document.querySelectorAll(".home-pictures-back")[0].innerHTML = getCard(Math.floor(Math.random()*3 + 11) + suits[Math.floor(Math.random()*4)], "home")
document.querySelectorAll(".home-pictures-back")[1].innerHTML = getCard(Math.floor(Math.random()*3 + 11) + suits[Math.floor(Math.random()*4)], "home")
var time = 1;
var interval = setInterval(function() {
    if (time <= 3) {
        document.querySelectorAll(".home-pictures-back")[0].innerHTML = getCard(Math.floor(Math.random()*3 + 11) + suits[Math.floor(Math.random()*4)], "home")
        document.querySelectorAll(".home-pictures-back")[1].innerHTML = getCard(Math.floor(Math.random()*3 + 11) + suits[Math.floor(Math.random()*4)], "home")
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
    const customMusic = localStorage.getItem("customMusic");
    const options = document.querySelectorAll('.menu li:not(.custom-song)');
    if (customMusic) {
        localStorage.setItem("customMusic", JSON.stringify({songs: JSON.parse(localStorage.getItem("customMusic")).songs.filter((song) => {return song.id && song.name && song.artist && song.img})}))
        loadSongOptions()
    }
    else{
        localStorage.setItem("customMusic", JSON.stringify({songs:[]}))
    }
    if(!localStorage.getItem("audioVolumes")){
        masterSlider.value = 50;
        musicSlider.value = 50;
        sfxSlider.value = 50;
    }
    else{
        masterSlider.value = localStorage.getItem("audioVolumes").split("-")[0];
        musicSlider.value = localStorage.getItem("audioVolumes").split("-")[1];
        sfxSlider.value = localStorage.getItem("audioVolumes").split("-")[2];
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

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    const savedMusicOption = localStorage.getItem("musicOption");
    if (savedMusicOption && savedMusicOption < dropdown.querySelectorAll('.menu li:not(.custom-song)').length) {
        dropdown.querySelectorAll('.menu li:not(.custom-song)')[savedMusicOption].click()
    }
    else{
        dropdown.querySelectorAll('.menu li:not(.custom-song)')[1].click()
    }
    updateVolume()
    event.target.playVideo();
}

function onPlayerStateChange(event){
    if (event.target.getPlayerState() === 0) {
        event.target.playVideo();
    }
}