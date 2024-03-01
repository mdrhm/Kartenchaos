
// document.addEventListener('DOMContentLoaded', function() {
//   var audio = document.getElementById("music");
//   audio.volume = 0.025;
// });


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

