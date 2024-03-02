
// document.addEventListener('DOMContentLoaded', function() {
//   var audio = document.getElementById("music");
//   audio.volume = 0.025;
// });



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
const sliders = document.querySelectorAll("input");
const slideValues = document.querySelectorAll(".slider-value span");

sliders.forEach((slider, index) => {
    slider.oninput = () => {
        let value = slider.value;
        slideValues[index].textContent = value;
        slideValues[index].style.left = (value / 2) + "%";
        slideValues[index].classList.add("show");
    };

    slider.onblur = () => {
        slideValues[index].classList.remove("show");
    };
});




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

const bgOptions = document.querySelectorAll(".bg-option")
const backgroundDiv = document.querySelector("#bg")
for(let i = 0; i < bgOptions.length; i++){
    bgOptions[i].addEventListener("click", () => {
        backgroundDiv.classList = "";
        backgroundDiv.classList.add("bg-" + i)
    })
}

const settingsButton = document.querySelector("#settings");
const settingsDiv = document.querySelector("#settings-page");
const settingsExit = document.querySelector(".settings-exit")
settingsButton.addEventListener("click", () => {
    settingsDiv.classList.remove("hidden")
})
settingsExit.addEventListener("click", () => {
    settingsDiv.classList.add("hidden")
})