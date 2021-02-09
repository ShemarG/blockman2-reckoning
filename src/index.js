const game = new Game(document.getElementById('el'));

function generateHUD() {
  game.HUD = {};
  const healthBar = document.createElement('div');
  healthBar.style.position = 'absolute';
  healthBar.style.display = 'flex';
  healthBar.style.height = '2em';
  healthBar.style.color = 'white';
  game.HUD.healthBar = healthBar;
  const label = document.createElement('span');
  label.textContent = 'Health';
  label.style.fontFamily = 'Goldman';
  healthBar.append(label);
  const bar = document.createElement('div');
  bar.style.display = 'flex';
  game.HUD.health = bar;
  for (let i = 0; i < game.player.stats.health; i++) addHealthUnit();
  healthBar.append(bar);
  game.area.append(healthBar);
  const pause = document.createElement('span');
  pause.classList.add('pause-button')
  pause.innerText = 'Pause';
  game.area.append(pause);
  pause.addEventListener('click', () => {
    if (pause.innerText === 'Pause' && game.player.stats.health !== 0) {
      debugger;
      pause.innerText = 'Resume';
      game.togglePause();
    } else if (pause.innerText === 'Resume' && game.player.stats.health !== 0) {
      pause.innerText = 'Pause';
      game.togglePause();
    }
  });
}
generateHUD()

function addHealthUnit() {
  const healthUnit = document.createElement('div');
  healthUnit.style.width = '1em';
  healthUnit.style.height = '1em';
  healthUnit.style.backgroundColor = 'red';
  healthUnit.style.margin = '0 0.1em 0 0.1em';
  game.HUD.health.append(healthUnit);
}


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

// const levelupScreen = document.getElementById('levelupScreen')
// levelupScreen.style.margin = '1.5em'
// const level = document.createElement('span')
// levelupScreen.append(level)
// level.innerText = 'Level Complete'
// level.style.fontFamily = 'Goldman'
// level.style.marginLeft = '2.5em'
// level.style.marginTop = '4em'
// level.style.fontSize = '3em'
// const skillPoints = document.createElement('div')
// levelupScreen.append(skillPoints)
// skillPoints.innerText = 'Skill Points : '
// skillPoints.style.fontFamily = 'Goldman'
// skillPoints.style.fontSize = '2em'
// skillPoints.style.marginTop = '1.5em'
// skillPoints.style.marginLeft = '7em'
// const healthPoints = document.createElement('span')
// healthPoints.innerText = 'Health Points'
// levelupScreen.append(healthPoints)

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
