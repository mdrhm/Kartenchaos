const card1 = document.querySelector('.card1')
const card2 = document.querySelector('.card2')
const suits = ["D","S","H","C"];
var time = 1;
var interval = setInterval(function() {
    if (time <= 3) {
            card1.src = "./cards/" + Math.floor(Math.random()*3 + 11) + suits[Math.floor(Math.random()*4)]+ ".svg"
            card2.src = "./cards/" + Math.floor(Math.random()*3 + 11) + suits[Math.floor(Math.random()*4)]+ ".svg"
        }
        else {
            clearInterval(interval);
        }
    }, 3000);

// Save Music Option
document.addEventListener('DOMContentLoaded', () => {
    const selectedBackground = localStorage.getItem("background");
    if (selectedBackground) {
        backgroundDiv.classList = selectedBackground;
        rulesBg.classList = selectedBackground;
        settingsBg.classList = selectedBackground;
    }

    const savedMusicOption = localStorage.getItem("musicOption");
    if (savedMusicOption) {
        const audioElement = document.getElementById("music");
        audioElement.src = "Audio/" + savedMusicOption + ".mp3";
        audioElement.load();
        audioElement.play();
        document.querySelector(".selected").innerHTML = savedMusicOption
    }
});



var customBgStyle = document.querySelector('.custom-bg-style');
loadCustomBgs()

