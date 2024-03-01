
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


const slideValue = document.querySelector("span");
const inputSlider = document.querySelector("input");
inputSlider.oninput = (() => {
  let value = inputSlider.value;
  slideValue.textContent = value;
  slideValue.style.left = (value / 2) + "%";
  slideValue.classList.add("show")
});
inputSlider.onblur = (() => {
  slideValue.classList.remove("show");
}); 


