
var p1Hp = document.getElementById('p1-health-bar');
var p2Hp = document.getElementById('p2-health-bar');
var dmg = 10;

// Spawns Player HP in the begining of the Screen
var p1_hp_total = 100;
var p2_hp_total = 100;
const incrementDelay = 20; 

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



// ATTACK BUTTONS FUNCTIONALITY, 
//*** ONLY FOR TESTING PURPOSES ***
const p1Attack = document.querySelector('.p1-attack');
const p2Attack = document.querySelector('.p2-attack');


p1Attack.addEventListener('click', () => {
  p2Hp.value = attackEnemy(p2Hp.value, dmg);
});

p2Attack.addEventListener('click', () => {
  p1Hp.value = attackEnemy(p1Hp.value, dmg);
  displayDamageTaken();
});

function attackEnemy(hp, dmg){
  if(hp < 1) {
    return 100;
  }
  return hp - dmg;
}



// Wait for the 'S' animation to finish, then add class to position 'V' element in the center
document.addEventListener('DOMContentLoaded', function() {
  var vElement = document.querySelector('.v');

  // Function to be executed after animation finishes
  function afterAnimation() {
    setTimeout(function() {
      vElement.classList.add('new-position');
    }, 1500); 
  }

  // Detect animation end for various browsers
  vElement.addEventListener('animationend', afterAnimation);
  vElement.addEventListener('webkitAnimationEnd', afterAnimation);
  vElement.addEventListener('oanimationend', afterAnimation);
  vElement.addEventListener('MSAnimationEnd', afterAnimation);
});



const p1DamageIndicatorContainer = document.querySelector('.p1-damage-indicator-container');

const p1DamageTaken = document.querySelector('.p1-damage-taken');

function displayDamageTaken() {
  // Reset animation by setting animation to 'none' first
  p1DamageIndicatorContainer.style.animation = 'none';
  // Trigger reflow to apply the reset immediately
  p1DamageIndicatorContainer.offsetHeight; // This line triggers a reflow, don't remove it
  
  // Set initial state
  p1DamageIndicatorContainer.style.alignItems = 'flex-start';
  p1DamageIndicatorContainer.style.left = `${p1Hp.value}%`;

  // Set alignItems to flex-end after a delay
  setTimeout(function() {
    p1DamageIndicatorContainer.style.alignItems = 'flex-end';
    // Start the animation
    p1DamageIndicatorContainer.style.animation = 'fallingDown 0.5s linear';
  }, 100);
  if(p1Hp.value == 100) {
    p1DamageIndicatorContainer.style.alignItems = 'flex-start';
  }
}



