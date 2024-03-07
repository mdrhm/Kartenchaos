// Adjusting Background Music Slider
const backgroundAudio = document.getElementById("music");
const masterSlider = document.querySelector('.master-slider');
const masterInput = document.querySelector('.master-input');

backgroundAudio.volume = masterSlider.value / 100;

// Update the volume of the background audio when the master volume slider is changed
masterSlider.addEventListener('input', () => {
    backgroundAudio.volume = masterSlider.value / 100;
    masterInput.value = masterSlider.value;
});

// Update the value of the master volume slider when the master volume input field is changed
masterInput.addEventListener('input', () => {
    masterSlider.value = masterInput.value;
    backgroundAudio.volume = masterInput.value / 100;
});


//GENERAL/AUDIO BUTTONS ON CLICK
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



// VOLUME SLIDERS
// const sliders = document.querySelectorAll("input");
// const slideValues = document.querySelectorAll(".slider-value span");

// sliders.forEach((slider, index) => {
//     slider.oninput = () => {
//         let value = slider.value;
//         slideValues[index].textContent = value;
//         slideValues[index].style.left = (value / 2) + "%";
//         slideValues[index].classList.add("show");
//     };
//
//     slider.onblur = () => {
//         slideValues[index].classList.remove("show");
//     };
// });

//MUSIC CHOOSER
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');

    select.addEventListener('click', () => {
        select.classList.toggle('selected-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;
            select.classList.remove('-selected-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');

            options.forEach(option => {
                option.classList.remove('active');
            });
            option.classList.add('active');
        });
    });
});


// const bgStockOptions = document.querySelectorAll(".bg-stock")
// let bgCustomOptions = document.querySelectorAll(".bg-custom")
let bgDelete = document.querySelectorAll(".delete-bg")
const rulesBg = document.querySelector("#rules-background")
const settingsBg = document.querySelector("#setting-background")
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
        sliderInputs[i].value = parseInt(sliderInputs[i].value).toFixed(0)
        sliders[i].value = sliderInputs[i].value;
    })
    sliderInputs[i].addEventListener("change", ()=>{
        if(sliderInputs[i].value === "") {
            sliderInputs[i].value = sliderInputs[i].placeholder;
            sliders[i].value = sliderInputs[i].value;
        }
        sliderInputs[i].placeholder = sliderInputs[i].value
    })
    sliders[i].addEventListener("input", () => {
        sliderInputs[i].value = sliders[i].value;
    })
}
function bgUpload(event) {
    var selectedFile = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        let custombgs = localStorage.getItem("custombgs")
        if(custombgs.includes(event.target.result)){
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
const customBgContainer = document.querySelector(".bg-custom-container")
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
            <img src="/Images/delete.svg" class="hidden delete-bg" onclick="deleteBg(${i})">
        </div>`;
    }

    
    const uploadDiv = document.querySelector(".bg-custom-upload-container")
    bgOptions.innerHTML += uploadDiv.outerHTML
    bgOptions.querySelector(".bg-custom-upload-container").classList.remove("hidden")
    // let bgCustomOptions = document.querySelectorAll(".bg-custom")
    // bgDelete = document.querySelectorAll(".delete-bg")
    // for(let i = 0; i < bgCustomOptions.length; i++) {
    //     bgDelete[i].addEventListener("click", () => {
    //         console.log(custombgs)
    //         custombgs.splice(i, 1);
    //         console.log(custombgs)
    //         localStorage.setItem("custombgs", custombgs.join("\n"))
    //         if (localStorage.getItem("background") === "custombg-" + i) {
    //             updateBg("bg-1")
    //         }
    //         loadCustomBgs()
    //     })
    // }
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

function updateBg(bg){
    // console.log("herro")
    backgroundDiv.classList = bg;
    rulesBg.classList = bg;
    settingsBg.classList = bg;
    localStorage.setItem("background", bg);
}

function updateCustomBg(bg, index, event){
    if(document.querySelectorAll(".delete-bg")[index].contains(event.target)){
        return;
    }
    // console.log("herro")
    backgroundDiv.classList = bg + "-" + index;
    rulesBg.classList = bg + "-" + index;
    settingsBg.classList = bg + "-" + index;
    localStorage.setItem("background", bg + "-"+ index);
}