
const p1Attack = document.querySelector('.p1-attack');
const p2Attack = document.querySelector('.p2-attack');
let p1Hp = document.getElementById('p1-health-bar');
let p2Hp = document.getElementById('p2-health-bar');
const dmg = 10;

p1Attack.addEventListener('click', () => {
  p2Hp.value = attackEnemy(p2Hp.value, dmg);
  updateWidth(p2Hp);
});

p2Attack.addEventListener('click', () => {
  p1Hp.value = attackEnemy(p1Hp.value, dmg);
  updateWidth(p1Hp);
});

function attackEnemy(hp, dmg){
  if(hp < 1) {
    return 100;
  }
  return hp - dmg;
}

function updateValueTransition(hp) {
  hp.style.transition = '2s ease';
}


// Wait for the animation to finish, then add class to position "V" element
document.addEventListener('DOMContentLoaded', function() {
  var vElement = document.querySelector('.v');

  // Function to be executed after animation finishes
  function afterAnimation() {
    setTimeout(function() {
      vElement.classList.add('new-position');
    }, 1500); // Adjust the delay time (in milliseconds) as needed
  }

  // Detect animation end for various browsers
  vElement.addEventListener('animationend', afterAnimation);
  vElement.addEventListener('webkitAnimationEnd', afterAnimation);
  vElement.addEventListener('oanimationend', afterAnimation);
  vElement.addEventListener('MSAnimationEnd', afterAnimation);
});

var p1_hp_total = 100;
var p2_hp_total = 100;
var incrementDelay = 20; // Delay between increments in milliseconds

for (let i = 0; i <= 100; i++) {
  if(i <= p1_hp_total){ 
  setTimeout(function() {
        p1Hp.value = i;
    }, i * incrementDelay);
  }

  if(i <= p2_hp_total){ 
    setTimeout(function() {
          p2Hp.value = i;
      }, i * incrementDelay);
    }
}


