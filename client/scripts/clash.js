
const p1Hp = document.getElementById('p1-health-bar');
const p2Hp = document.getElementById('p2-health-bar');
const p1DamageIndicatorContainer = document.querySelector('.p1-damage-indicator-container');
const p1DamageTaken = document.querySelector('.p1-damage-taken');
const p2DamageIndicatorContainer = document.querySelector('.p2-damage-indicator-container');
const p2DamageTaken = document.querySelector('.p2-damage-taken');

// Load Player HP + Adds Animation as HP loads
loadPlayerHP(p1Hp);
loadPlayerHP(p2Hp);


// ATTACK BUTTONS FUNCTIONALITY, 
//*** ONLY FOR TESTING PURPOSES ***
const p1Attack = document.querySelector('.p1-attack');
const p2Attack = document.querySelector('.p2-attack');
var dmg = 10;

p1Attack.addEventListener('click', () => {
  p2Hp.value = attackEnemy(p2Hp.value, dmg);
  displayDamageTaken(p2DamageIndicatorContainer, p2DamageTaken, p2Hp, 'right');
});

p2Attack.addEventListener('click', () => {
  p1Hp.value = attackEnemy(p1Hp.value, dmg);
  displayDamageTaken(p1DamageIndicatorContainer, p1DamageTaken, p1Hp, 'left');
});

function attackEnemy(hp, dmg){
  if(hp < 1) {
    return 100;
  }
  return hp - dmg;
}



// Spawns Player HP in the begining of the Screen
function loadPlayerHP(hp) {
  var totalHP = hp.value;
  hp.value = 0;
  const incrementDelay = 20;
  for (let i = 0; i <= totalHP; i++) { 
    setTimeout(function() {
          hp.value = i;
      }, i * incrementDelay);
  }
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



function displayDamageTaken(damageIndicatorContainer, damageTaken, hp, direction) {
  damageIndicatorContainer.style.animation = 'none';
  damageIndicatorContainer.offsetHeight; 
  damageIndicatorContainer.style[direction] = `${hp.value}%`;

  if(hp.value === 100) {
    return;
  }

  setTimeout(function() {
    damageTaken.classList.remove('hidden');
    damageIndicatorContainer.style.animation = 'fallingDown 0.7s linear forwards';
    setTimeout(function(){
      damageTaken.classList.add('hidden');
    }, 800);
  }, 100);
}



