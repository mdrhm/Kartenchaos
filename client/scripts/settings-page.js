// AUDIO SETTINGS SLIDERS AND INPUTS FUNCTIONALITY

// Selectors
const musicSlider = document.querySelector('.music-slider');
const musicInput = document.querySelector('.music-input');
const backgroundAudio = document.getElementById("music");
const masterSlider = document.querySelector('.master-slider');
const masterInput = document.querySelector('.master-input');
const sfxAudio = document.getElementById('voiceover');
const sfxMenuSelectAudio = document.getElementById('menu-select');
const sfxSlider = document.querySelector('.sfx-slider');
const sfxInput = document.querySelector('.sfx-input');

// Initial volume settings
const defaultVolume = 0.05;
const defaultSfxVolume = 0.5;
sfxAudio.volume = defaultSfxVolume;
sfxMenuSelectAudio.volume = defaultSfxVolume;

// Note: Music Slider will act as a multiplier to the Master Volume.
let musicMultiplier = 1;
let sfxMultiplier = 1;

// Event listeners
masterSlider.addEventListener('input', updateVolume);
masterInput.addEventListener('input', handleInputChange);
musicSlider.addEventListener('input', updateVolume);
musicInput.addEventListener('input', handleInputChange);
sfxSlider.addEventListener('input', updateVolume);
sfxInput.addEventListener('input', handleInputChange);

// Function to update volume
function updateVolume() {
    localStorage.setItem("audioVolumes", masterSlider.value + "-" + musicSlider.value + "-" + sfxSlider.value)
    const masterVolume = masterSlider.value / 100;
    const adjustedMusicVolume = (masterVolume / 100) * musicSlider.value;
    const adjustedSfxVolume = (masterVolume / 100) * sfxSlider.value ;
    player.setVolume(adjustedMusicVolume * 100);
    sfxAudio.volume = adjustedSfxVolume;
    sfxMenuSelectAudio.volume = adjustedSfxVolume;
    masterInput.value = masterSlider.value;
    musicInput.value = musicSlider.value;
    sfxInput.value = sfxSlider.value;
}

// Function to handle direct input into input fields
function handleInputChange() {
    const inputValue = parseInt(this.value, 10);

    if (!isNaN(inputValue)) {
        if (this === masterInput) {
            masterSlider.value = inputValue;
        }
        else if (this === musicInput) {
            musicSlider.value = inputValue;
        }
        else if (this === sfxInput) {
            sfxSlider.value = inputValue;
        }
        updateVolume();
    }
}

//GENERAL & AUDIO BUTTONS ON CLICK
const btnElList = document.querySelectorAll('.main-btn');

btnElList.forEach(btnEl => {
    btnEl.addEventListener('click', () => {
        // Check if any button element has class 'clicked'
        const clickedBtns = document.querySelectorAll('.clicked');
        // Remove 'clicked' class from all elements with class 'clicked'
        clickedBtns.forEach(clickedBtn => {
            clickedBtn.classList.remove('clicked');
            clickedBtn.classList.add('hover-enabled');
        });
        // Add 'clicked' class to the currently clicked button
        btnEl.classList.remove('hover-enabled');
        btnEl.classList.add('clicked');
    });
});


const audioResetBtn = document.querySelector('.reset-btn');
const generalResetBtn = document.querySelector('.general-reset-btn');

// Audio-Reset
audioResetBtn.addEventListener('click', () => {
    var i = 0;
    sliderInputs.forEach(sliderInput => {
        sliderInput.value = 50;
        sliders[i].value = sliderInputs[i].value;
        backgroundAudio.volume = defaultVolume;
        sfxAudio.volume = defaultSfxVolume;
        sfxMenuSelectAudio.volume = defaultSfxVolume;
        musicMultiplier = 1;
        sfxMultiplier = 1;
        i++;
    })


    const defaultSound = document.querySelector('.menu .default-sound');
    document.querySelector('.menu .hidden').classList.remove('hidden');
    defaultSound.classList.add('hidden');
    document.querySelector('.selected').innerText = defaultSound.innerText;
    audioChoiceLoad(defaultSound);


});

generalResetBtn.addEventListener('click', () => {
    updateBg("bg-0");
    updateCardStyle('default');
});

//LOADS UP CLICKED SECTION
const audioEl = document.querySelector('#Audio-Setting-Option');

const generalEl = document.querySelector('#General-Setting-Option');

const generalBtn = document.querySelector('.general button');

const audioBtn = document.querySelector('.audio button');

audioBtn.addEventListener('click', () => {
    audioEl.classList.remove('display-disabled');
    generalEl.classList.add('display-disabled');
});

generalBtn.addEventListener('click', () => {
    generalEl.classList.remove('display-disabled');
    audioEl.classList.add('display-disabled');
});

// Select between options for bg music
const dropdown = document.querySelector('.dropdown');
const select = dropdown.querySelector('.select');
const caret = dropdown.querySelector('.caret');
const menu = dropdown.querySelector('.menu');
const selected = dropdown.querySelector('.selected');

select.addEventListener('click', () => {
    select.classList.toggle('selected-clicked');
    caret.classList.toggle('caret-rotate');
    menu.classList.toggle('menu-open');
});

function addMusicClick(){
    const options = dropdown.querySelectorAll('.menu li:not(.custom-song)');
    for(let i = 0; i < options.length; i++) {
        let option = options[i]
        option.addEventListener('click', () => {
            options.forEach(optionTemp => {
                optionTemp.classList.remove("hidden");
            })
            option.classList.add("hidden")
            // selected.innerText = option.innerText;
            playSong(option.getAttribute("link"))
            document.querySelector(".selected").innerHTML = option.innerHTML;
            const selectedOuter = document.querySelector(".selected-outer")
            document.addEventListener("mousemove", () => {
                addOverflowAnimation(document.querySelector(".selected .li-inner-title"), 1)
                addOverflowAnimation(document.querySelector(".selected .li-inner-artist"), 1)
            })
            localStorage.setItem("musicOption", i);
        });
    }
}
document.addEventListener("click", (event) => {
    if (!select.contains(event.target)) {
        menu.classList.remove('menu-open');
        caret.classList.remove('caret-rotate');
        select.classList.remove('selected-clicked');
    }
})

function audioChoiceLoad(audioOption) {
    const audioElement = document.getElementById("music");
    audioElement.src = "Audio/" + audioOption.innerText + ".mp3";
    audioElement.load();
    audioElement.play();
}

// const bgStockOptions = document.querySelectorAll(".bg-stock")
// let bgCustomOptions = document.querySelectorAll(".bg-custom")
let bgDelete = document.querySelectorAll(".delete-bg")
const rulesBg = document.querySelector("#rules-background")
const settingsBg = document.querySelector("#setting-background")
const errorBg = document.querySelector("#error-background")
const backgroundDiv = document.querySelector("#bg")

const settingsButton = document.querySelector("#settings");
const settingsDiv = document.querySelector("#settings-page");
const saveButtons = document.querySelectorAll(".save-btn")
settingsButton.addEventListener("click", () => {
    settingsDiv.classList.remove("hidden")
})

for(saveButton of saveButtons)
    saveButton.addEventListener("click", () => {
        settingsDiv.classList.add("hidden")
    })

const sliderInputs = document.querySelectorAll(".slider-input");
const sliders = document.querySelectorAll(".range-style");
for(let i = 0; i < 3; i++) {
    sliderInputs[i].addEventListener("input", ()=>{
        if(sliderInputs[i].value > 100){
            sliderInputs[i].value = 100;
        }
        if(sliderInputs[i].value < 0){
            sliderInputs[i].value = 0;
        }
        sliderInputs[i].addEventListener("change", ()=>{
            if(sliderInputs[i].value === "") {
                sliderInputs[i].value = sliderInputs[i].placeholder;
                sliders[i].value = sliderInputs[i].value;
                updateVolume();
            }
            sliderInputs[i].placeholder = sliderInputs[i].value
        })
        sliders[i].addEventListener("input", () => {
            sliderInputs[i].value = sliders[i].value;
        })
        sliderInputs[i].value = parseInt(sliderInputs[i].value).toFixed(0)
        sliders[i].value = sliderInputs[i].value; // Update corresponding slider value
    });
    sliders[i].addEventListener("input", () => { // Add input event listener to each slider
        sliderInputs[i].value = sliders[i].value; // Update corresponding slider input value
    });
}

function bgUpload(event) {
    var selectedFile = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        let custombgs = localStorage.getItem("custombgs")
        if(custombgs && custombgs.includes(event.target.result)){
            return;
        }
        custombgs += event.target.result + "\n";
        localStorage.setItem("custombgs", custombgs.replaceAll("null",""))
        loadCustomBgs();
        updateBg("custombg-" + ((custombgs.split("\n").length)-2))
    };
    reader.readAsDataURL(selectedFile);
    document.querySelector(".bg-custom-select").value = "";
}

const bgOptions = document.querySelector(".bg-options")
const stockBgContainer = document.querySelector(".bg-stock-container")
function loadCustomBgs() {
    bgOptions.innerHTML = stockBgContainer.innerHTML;
    customBgStyle.innerHTML = "";
    if (localStorage.getItem("custombgs") === null) {
        const uploadDiv = document.querySelector(".bg-custom-upload-container")
        bgOptions.innerHTML += uploadDiv.outerHTML
        bgOptions.querySelector(".bg-custom-upload-container").classList.remove("hidden")
        return;
    }
    let custombgs = localStorage.getItem("custombgs").split("\n")
    for (let i = 0; i < custombgs.length - 1; i++) {
        customBgStyle.innerHTML += `.custombg-${i} {
            background-image: url("${custombgs[i]}");
            background-repeat: no-repeat;
            background-size: cover;
            height: 100%;
            width: 100%;
        }`;

        bgOptions.innerHTML += `<div class="bg-option bg-custom custombg-${i}" onclick="updateCustomBg('custombg', ${i}, this)">
            <img src="/client/Images/delete.svg" class="hidden delete-bg" onclick="deleteBg(${i})">
        </div>`;
    }

    const uploadDiv = document.querySelector(".bg-custom-upload-container")
    bgOptions.innerHTML += uploadDiv.outerHTML
    bgOptions.querySelector(".bg-custom-upload-container").classList.remove("hidden")
}

function deleteBg(i) {
    let custombgs = localStorage.getItem("custombgs").split("\n")
    console.log(custombgs)
    custombgs.splice(i, 1);
    console.log(custombgs)
    localStorage.setItem("custombgs", custombgs.join("\n"))
    if (localStorage.getItem("background") === "custombg-" + i) {
        updateBg("bg-0")
    }
    loadCustomBgs()
}

function updateBg(bg) {
    if(document.querySelector(".bg-options .selected-option")) {
        document.querySelector(".bg-options .selected-option").outerHTML = document.querySelector(".bg-options .selected-option").innerHTML
    }
    const selectedOption = document.querySelector(`.bg-option.${bg}`);
    if (selectedOption) {
        selectedOption.outerHTML = `<div class = "selected-option"> ${selectedOption.outerHTML}</div>`
    }

    backgroundDiv.classList = bg;
    rulesBg.classList = bg;
    settingsBg.classList = bg;
    errorBg.classList = bg;
    localStorage.setItem("background", bg);
}
function updateCustomBg(bg, index, event){
    if(document.querySelectorAll(".delete-bg")[index].contains(event.target)){
        return;
    }
    updateBg(bg + "-" + index);
}
function updateCardStyle(style) {
    if(document.querySelector(".change-card-options .selected-option")) {
        document.querySelector(".change-card-options .selected-option").outerHTML = document.querySelector(".change-card-options .selected-option").innerHTML
    }
    const selectedOption = document.querySelector(`.card-style-option.${style}`);
    if (selectedOption) {
        selectedOption.outerHTML = `<div class = "selected-option"> ${selectedOption.outerHTML}</div>`
    }
    document.querySelector("#home-pictures-inner-left").classList = style;
    document.querySelector("#home-pictures-inner-right").classList = style;
    localStorage.setItem("cardstyle", style);
    socket.emit("updateCardStyleForAll", {roomID: getRoomIDFromURL(), style: style})
}
document.querySelector(".settings-main-phase").addEventListener("click", ()=> {
    settingsDiv.classList.remove("hidden")
})

function playSong(songID){
    player.loadVideoById(songID,0)
}

function showSongSearch(){
    document.querySelector(".song-search").classList.remove("hidden")
    songQuery.focus()
    document.querySelector(".song-search").addEventListener("click", (e) =>{
        if(!songQuery.contains(e.target) && !songsContainer.contains(e.target)){
            document.querySelector(".song-search").classList.add("hidden")
        }
    })
    songQuery.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if(songQuery.value === ""){
                document.querySelector(".song-search").classList.add("hidden")
            }
            songQuery.value = ""
            songsContainer.classList.add("invisible")
        }
    });
}

const songQuery = document.querySelector(".song-query")
const songsContainer = document.querySelector(".songs")
const customSongsDiv = document.querySelector(".custom-songs")
let songs, typingTimer;

songQuery.addEventListener("input", () => {
    clearTimeout(typingTimer);
    let song = songQuery.value
    if (song.replaceAll(" ", "") === "") {
        songsContainer.classList.add("invisible")
        songsContainer.innerHTML = ""
        return;
    }
    if(songsContainer.innerHTML !== '<div class="loader-outer"> <div class="loader"></div></div>') {
        songsContainer.innerHTML = '<div class="loader-outer"> <div class="loader"></div></div>'
    }
    songsContainer.classList.remove("invisible")
    typingTimer = setTimeout(() => {
        socket.emit("spotify_api_call", {song: song})
    }, 250)
})
socket.on("spotify_api_response", (data)=>{
    if(data.error){
        songsContainer.innerHTML = `<span class = "no-song-found">${data.error}</span>`
        return;
    }
    songs = data.songs;
    songsContainer.innerHTML = ""
    songsContainer.classList.remove("invisible")
    for(let i = 0; i < songs.length; i++) {
        songsContainer.innerHTML += `<div class="song"><img src=${songs[i].img} style="--translate: 0px; --translate-duration: 0s;"><div class="song-inner"> <div class="song-inner-title">${songs[i].name}</div><div class="song-inner-artist">${songs[i].artist.replaceAll(";", ",")}</div></div></div>`
        addOverflowAnimation(songsContainer.childNodes[i].querySelector(".song-inner-title"), 0)
        addOverflowAnimation(songsContainer.childNodes[i].querySelector(".song-inner-artist"), 0)
    }
    for(let i = 0; i < songsContainer.childNodes.length; i++){
        songsContainer.childNodes[i].addEventListener(("click"), ()=> {
            socket.emit("youtube_api_call", {name: songs[i].name, artist: songs[i].artist, img: songs[i].img, url: songs[i].url})
        })
    }
})

socket.on("youtube_api_response", (data) => {
    document.querySelector(".song-search").classList.add("hidden")
    document.querySelector(".song-query").value = ""
    songsContainer.innerHTML = ""
    songsContainer.classList.add("invisible")
    let songs = JSON.parse(localStorage.getItem("customMusic"))
    let song = {id: data.videoId, name: data.name, artist: data.artist, img: data.img}
    if (localStorage.getItem("customMusic").includes(JSON.stringify(song))) {
        songs.songs.splice(songs.songs.map(e => e.songID).indexOf(song.songID), 1)
    }
    songs.songs.push(song)
    if (songs.songs.length === 6) {
        songs.songs.splice(0, 1)
    }
    localStorage.setItem("customMusic", JSON.stringify(songs))
    loadSongOptions()
    dropdown.querySelector('.menu li:not(.custom-song):last-child').click()
})

function loadSongOptions(){
    customSongsDiv.innerHTML = ""
    let songs = JSON.parse(localStorage.getItem("customMusic")).songs
    for(let i = 0; i < songs.length; i++){
        customSongsDiv.innerHTML += `<li link="${songs[i].id}">
            <img src=${songs[i].img}><div class="li-inner"><div class="li-inner-title">${songs[i].name}</div><div class="li-inner-artist">${songs[i].artist.replaceAll(";", ",")}</div></div></li>`
        document.addEventListener("mousemove", () => {
            addOverflowAnimation(customSongsDiv.childNodes[i].querySelector(".li-inner-title"), 0)
            addOverflowAnimation(customSongsDiv.childNodes[i].querySelector(".li-inner-artist"), 0)
        })
    }
    addMusicClick()
}

function addOverflowAnimation(divContainer, offset) {
    if(!divContainer){
        return;
    }
    let translateDistance = divContainer.offsetWidth - divContainer.parentElement.offsetWidth + offset
    if (translateDistance <= offset) {
        translateDistance = 0;
    }
    divContainer.style = `--translate: ${translateDistance}px; --translate-duration: ${translateDistance / 4}s`
}