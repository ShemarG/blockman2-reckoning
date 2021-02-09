const game = new Game(document.getElementById('el'));

function generateHUD() {
  game.HUD = {};
  const hudContainer = document.createElement('div');
  game.HUD.topLevel = hudContainer;
  hudContainer.classList.add('hud-container');
  const healthAndAdrenalineContainer = document.createElement('div');
  healthAndAdrenalineContainer.classList.add('health-and-adrenaline-container');
  const healthBarWrapper = document.createElement('div');
  healthBarWrapper.classList.add('health-bar-wrapper');
  const healthSpan = document.createElement('span');
  healthSpan.textContent = 'Health:';
  healthSpan.classList.add('health-span');
  const healthBar = document.createElement('div');
  game.HUD.health = healthBar;
  for (let i = 0; i < game.player.stats.health; i++) game.addHealthUnit();
  healthBar.classList.add('health-bar');
  const adrenalineBar = document.createElement('div');
  adrenalineBar.classList.add('adrenaline-bar');
  const adrenalineBarInner = document.createElement('div');
  game.HUD.adrenaline = adrenalineBarInner;
  adrenalineBarInner.classList.add('adrenaline-bar-inner');
  adrenalineBar.append(adrenalineBarInner);
  healthBarWrapper.append(healthSpan, healthBar);
  healthAndAdrenalineContainer.append(healthBarWrapper, adrenalineBar);

  const statusContainer = document.createElement('div');
  statusContainer.classList.add('status-container');
  const activePowerUps = document.createElement('div');
  activePowerUps.classList.add('active-powerups');
  const speedSlot = document.createElement('div');
  speedSlot.style.opacity = '0';
  speedSlot.classList.add('powerup-slot');
  const speedSlotIcon = document.createElement('img');
  speedSlotIcon.src = '../assets/play-forward-sharp.svg';
  speedSlotIcon.classList.add('powerup-slot-icon');
  const speedSlotText = document.createElement('span');
  game.HUD.speedSlot = { cont: speedSlot, icon: speedSlotIcon, text: speedSlotText };
  speedSlotText.textContent = '10';
  speedSlotText.classList.add('powerup-slot-text');
  speedSlot.append(speedSlotIcon, speedSlotText);

  const invinceSlot = document.createElement('div');
  invinceSlot.style.opacity = '0';
  invinceSlot.classList.add('powerup-slot');
  const invinceSlotIcon = document.createElement('img');
  invinceSlotIcon.src = '../assets/shield-sharp.svg';
  invinceSlotIcon.classList.add('powerup-slot-icon');
  const invinceSlotText = document.createElement('span');
  game.HUD.invinceSlot = { cont: invinceSlot, icon: invinceSlotIcon, text: invinceSlotText };
  invinceSlotText.textContent = '10';
  invinceSlotText.classList.add('powerup-slot-text');
  invinceSlot.append(invinceSlotIcon, invinceSlotText);

  activePowerUps.append(speedSlot, invinceSlot);

  const perkContainer = document.createElement('div');
  perkContainer.classList.add('perk-container');

  const experienceContainer = document.createElement('div');
  experienceContainer.classList.add('experience-container');
  const expSpan = document.createElement('span');
  expSpan.classList.add('exp-span');
  expSpan.textContent = 'Exp:';
  const expCounter = document.createElement('span');
  game.HUD.exp = expCounter;
  expCounter.textContent = `0/${LevelData.characterLevelUpBreakpoints[0]}`;
  expCounter.classList.add('exp-counter');

  experienceContainer.append(expSpan, expCounter);

  statusContainer.append(activePowerUps, perkContainer, experienceContainer);
  hudContainer.append(healthAndAdrenalineContainer, statusContainer);
  game.area.append(hudContainer);
}
generateHUD();

const homeScreen = document.getElementById('homescreen');

const startButton = document.getElementById('start');
startButton.innerText = 'Press Start';
startButton.style.fontSize = '4em';
startButton.style.color = 'white';
startButton.style.marginTop = '5em';
startButton.style.marginLeft = '2.1em';
startButton.style.fontFamily = 'Goldman';
startButton.style.fontWeight = '900';

const aboutButton = document.getElementById('about');
aboutButton.innerText = 'About';
aboutButton.style.fontFamily = 'Goldman';
aboutButton.style.fontSize = '2em';
aboutButton.style.marginTop = '20em';
aboutButton.style.marginLeft = '1em';

const aboutUs = document.getElementById('aboutUs');
aboutUs.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
aboutUs.style.fontFamily = 'Goldman';
aboutUs.style.fontSize = '1.5em';
aboutUs.style.color = 'white';
aboutUs.style.marginTop = '8em';
aboutUs.style.marginLeft = '2em';

const backButton = document.getElementById('backbutton');
backButton.innerText = 'Back';
backButton.style.fontFamily = 'Goldman';
backButton.style.marginTop = '20em';
backButton.style.marginLeft = '1em';
backButton.style.fontSize = '2em';

const restartButton = document.getElementById('restartButton');
restartButton.innerText = 'Try Again';
restartButton.style.display = 'none';
restartButton.style.color = 'white';

document.addEventListener('despawn-powerup', (e) => {
  game.powerUps[e.detail.key].element.remove();
  delete game.powerUps[e.detail.key];
});

document.addEventListener('powerup-tick', (e) => {
  switch (e.detail.type) {
    case 'Invincibility':
      game.HUD.invinceSlot.text.textContent = e.detail.val;
      break;
    case 'Speed':
      game.HUD.speedSlot.text.textContent = e.detail.val;
      break;
    default:
      console.log('Should be unreachable');
  }
});

document.addEventListener('invincibility-over', () => {
  console.log('Invincibility Over');
  game.HUD.invinceSlot.cont.style.opacity = '0';
  game.HUD.invinceSlot.text.textContent = '10';
  game.player.invincible = false;
  game.player.powerUpTimers.invincibility.resetTimer();
});

document.addEventListener('speed-over', () => {
  console.log('Speed Over');
  game.HUD.speedSlot.cont.style.opacity = '0';
  game.HUD.speedSlot.text.textContent = '10';
  game.player.stats.speed -= 1;
  game.player.powerUpTimers.speed.resetTimer();
});

document.addEventListener('health-restored', (e) => {
  if (e.detail.health === 1) addHealthUnit();
  if (e.detail.health === 2) { addHealthUnit(); addHealthUnit(); }
});

startButton.addEventListener('click', () => {
  game.togglePause();
  startButton.style.display = 'none';
  homeScreen.style.display = 'none';
  aboutButton.style.display = 'none';
  aboutPage.style.display = 'none';
  aboutUs.style.display = 'none';
  backButton.style.display = 'none';
});

aboutButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  homeScreen.style.display = 'none';
  aboutButton.style.display = 'none';
  backButton.style.display = 'block';
  aboutUs.style.display = 'block';
});

backButton.addEventListener('click', () => {
  backButton.style.display = 'none';
  aboutUs.style.display = 'none';
  startButton.style.display = 'block';
  aboutButton.style.display = 'block';
});

restartButton.addEventListener('click', () => {
  window.location.reload();
});

document.addEventListener('game-over', () => {
  restartButton.style.display = 'block';
});
