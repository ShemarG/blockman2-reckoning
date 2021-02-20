let game = new Game(document.getElementById('el'));
let statUpgrades;
let musicAllowed = false;

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
  adrenalineBarInner.style.width = game.player.stats.adrenaline ? '100%' : '0%';
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
  speedSlotIcon.src = 'assets/play-forward-sharp.svg';
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
  invinceSlotIcon.src = 'assets/shield-sharp.svg';
  invinceSlotIcon.classList.add('powerup-slot-icon');
  const invinceSlotText = document.createElement('span');
  game.HUD.invinceSlot = { cont: invinceSlot, icon: invinceSlotIcon, text: invinceSlotText };
  invinceSlotText.textContent = '10';
  invinceSlotText.classList.add('powerup-slot-text');
  invinceSlot.append(invinceSlotIcon, invinceSlotText);

  activePowerUps.append(speedSlot, invinceSlot);

  const perkContainer = document.createElement('div');
  game.HUD.perkList = perkContainer;
  perkContainer.classList.add('perk-container');

  const experienceContainer = document.createElement('div');
  experienceContainer.classList.add('experience-container');
  const expSpan = document.createElement('span');
  expSpan.classList.add('exp-span');
  expSpan.textContent = 'Exp:';
  const expCounter = document.createElement('div');
  game.HUD.exp = expCounter;
  expCounter.textContent = `0/${LevelData.characterLevelUpBreakpoints[1]}`;
  expCounter.classList.add('exp-counter');

  experienceContainer.append(expSpan, expCounter);

  statusContainer.append(activePowerUps, perkContainer, experienceContainer);
  hudContainer.append(healthAndAdrenalineContainer, statusContainer);
  game.area.append(hudContainer);
}
generateHUD();

function init() {
  game.eventHandlers = {};
  game.eventHandlers.handleBulletRemoval = game.handleBulletRemoval.bind(game);
  game.eventHandlers.controls = game.controls.bind(game);
  document.addEventListener('remove-bullet', game.eventHandlers.handleBulletRemoval);
  document.addEventListener('keydown', game.eventHandlers.controls);
  document.addEventListener('keyup', game.eventHandlers.controls);
}
init();

function playSound(sound) {
  if (sound.paused) {
    sound.play();
  } else {
    sound.currentTime = 0;
  }
}

const generateSkillBlock = (color) => {
  const div = document.createElement('div');
  div.classList.add('skill-block');
  div.style.backgroundColor = color;
  return div;
};
const generatePlus = () => {
  const img = document.createElement('img');
  img.src = 'assets/add-sharp.svg';
  return img;
};
const generateMinus = () => {
  const img = document.createElement('img');
  img.src = 'assets/remove-sharp.svg';
  return img;
};
const setPlusButtons = () => {
  Array.from(document.getElementsByClassName('plus-button')).forEach((button) => {
    button.innerHTML = '';
    switch (statUpgrades.validateSkill(button.dataset.skill)) {
      case false:
        button.append(generatePlus());
        button.disabled = true;
        break;
      case true:
        button.append(generatePlus());
        button.disabled = false;
        break;
      case 'MAX':
        button.textContent = statUpgrades.validateSkill(button.dataset.skill);
        button.disabled = true;
        break;
      default:
        button.textContent = `Lv.${statUpgrades.validateSkill(button.dataset.skill)}`;
        button.disabled = true;
    }
  });
};
const setMinusButtons = () => {
  Array.from(document.getElementsByClassName('minus-button')).forEach((button) => {
    button.disabled = !(statUpgrades.checkRemovable(button.dataset.skill));
  });
};
const setLvlAndSkill = () => {
  document.getElementById('level').textContent = `Level ${statUpgrades.skills.level}`;
  document.getElementById('points').textContent = `Skill Points: ${statUpgrades.skills.skillPoints}`;
};
const setConfirm = () => {
  if (statUpgrades) {
    if (Array.from(document.getElementsByClassName('minus-button')).every((button) => button.disabled === true)) {
      document.getElementById('confirm-button').disabled = true;
    } else {
      document.getElementById('confirm-button').disabled = false;
    }
  } else {
    document.getElementById('confirm-button').disabled = true;
  }
};
const emptySkillBars = () => {
  Array.from(document.getElementsByClassName('skill-bar')).forEach((bar) => { bar.innerHTML = ''; });
};

const homeScreen = document.getElementById('home');
const gameScreen = document.getElementById('game');
const restartButton = document.getElementById('restart-button');
const mainMenuButton = document.getElementById('main-menu-button');
const startButton = document.getElementById('start');
const confirmButton = document.getElementById('confirm-button');
const muteButton = document.getElementById('mute-music');

const levelUpSound = document.getElementById('sound-level-up');
const buffSound = document.getElementById('sound-buff');
const debuffSound = document.getElementById('sound-debuff');
const expSound = document.getElementById('sound-exp');
const kaboomSound = document.getElementById('sound-kaboom');
const adrReadySound = document.getElementById('sound-adr-ready');
const healthSound = document.getElementById('sound-health');
const blockSound = document.getElementById('sound-block');
const damageSound = document.getElementById('sound-damage');
const confirmSound = document.getElementById('sound-confirm');
const buttonSound = document.getElementById('sound-button');
const adrOverSound = document.getElementById('sound-adr-over');
const adrStartSound = document.getElementById('sound-adr-start');
const invincSound = document.getElementById('sound-invinc-hit');
const buttonSelect = document.getElementById('sound-button-select');
const gameMusic = document.getElementById('sound-game-music');
const gameOverScratch = document.getElementById('sound-game-over-scratch');

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
    case 'Adrenaline':
      break;
    case 'Adrenaline-Recharge':
      break;
    default:
  }
});
document.addEventListener('exp-pickup', () => {
  playSound(expSound);
});
document.addEventListener('health-pickup', () => {
  playSound(healthSound);
});
document.addEventListener('kaboom-pickup', () => {
  playSound(kaboomSound);
});
document.addEventListener('blocked', () => {
  playSound(blockSound);
});
document.addEventListener('damage', () => {
  playSound(damageSound);
});
document.addEventListener('invinc-hit', () => {
  playSound(invincSound);
});
document.addEventListener('check-perks', () => {
  game.HUD.perkList.innerHTML = '';
  game.player.perks.forEach((perk) => {
    const img = document.createElement('img');
    img.classList.add('perk-img');
    switch (perk) {
      case 'Healthy':
        img.src = 'assets/fitness-sharp.svg';
        break;
      case 'Aegis':
        img.src = 'assets/shield-half-sharp.svg';
        break;
      case 'C-Speed':
        img.src = 'assets/flash-sharp.svg';
        break;
      case 'Fortunate':
        img.src = 'assets/trending-up-sharp.svg';
        break;
      case 'Reflexes':
        img.src = 'assets/pulse-sharp.svg';
        break;
      case 'Relativity':
        img.src = 'assets/logo-react.svg';
        break;
      default:
    }
    game.HUD.perkList.append(img);
  });
});

document.addEventListener('adrenaline-activated', () => {
  game.HUD.adrenaline.style.webkitTransition = `width ${game.player.powerUpTimers.adrenaline.timeLeft + 1}s linear`;
  game.player.powerUpTimers.adrenaline.startTimer();
  game.HUD.adrenaline.style.width = '0%';
  clearInterval(game.gameTick);
  clearInterval(game.spawnTick);
  game.gameTick = setInterval(() => {
    game.movePlayer();
    game.spawnPowerUp();
  }, 10);
  playSound(adrStartSound);
});
document.addEventListener('adrenaline-over', () => {
  game.HUD.adrenaline.style.webkitTransition = `width ${game.player.adrenalineCooldown.timeLeft + 1}s linear`;
  game.player.adrenalineCooldown.startTimer();
  game.HUD.adrenaline.style.width = '100%';
  clearInterval(game.gameTick);
  game.gameTick = setInterval(() => {
    game.moveBullets();
    game.movePlayer();
    game.spawnPowerUp();
  }, 10);
  game.spawnTick = setInterval(() => {
    game.spawnBullet();
  }, LevelData.bulletSpawnRates[game.player.stats.level]);
  playSound(adrOverSound);
});
document.addEventListener('adrenaline-recharged', () => {
  game.player.adrenalineCooldown.resetTimer();
  game.player.powerUpTimers.adrenaline.resetTimer();
  playSound(adrReadySound);
});

document.addEventListener('invincibility-started', () => {
  playSound(buffSound);
});
document.addEventListener('invincibility-over', () => {
  game.HUD.invinceSlot.cont.style.opacity = '0';
  game.HUD.invinceSlot.text.textContent = '10';
  if (!game.player.perks.includes('C-Speed')) {
    game.player.invincible = false;
  } else if (!(game.player.powerUpTimers.speed.currentTimer)) {
    game.player.invincible = false;
  }
  game.player.powerUpTimers.invincibility.resetTimer();
  playSound(debuffSound);
});

document.addEventListener('speed-started', () => {
  playSound(buffSound);
});
document.addEventListener('speed-over', () => {
  game.HUD.speedSlot.cont.style.opacity = '0';
  game.HUD.speedSlot.text.textContent = '10';
  if (game.player.perks.includes('C-Speed') && !game.player.powerUpTimers.invincibility.currentTimer) {
    game.player.invincible = false;
  }
  game.player.powerUpTimers.speed.resetTimer();
  playSound(debuffSound);
});

document.getElementById('win-continue').addEventListener('click', () => {
  document.getElementById('game-win-screen').style.display = 'none';
  game.isOver = false;
});
document.getElementById('win-restart-button').addEventListener('click', () => { restartButton.click(); });
document.getElementById('win-main-menu-button').addEventListener('click', () => { mainMenuButton.click(); });

startButton.addEventListener('click', () => {
  gameMusic.volume = 0.2;
  if (musicAllowed) playSound(gameMusic);
  if (statUpgrades) {
    restartButton.click();
  } else {
    statUpgrades = new LevelUpInterface(game.player);
    game.startGame();
    game.isOver = false;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'p') {
        if (game.player.stats.health !== 0 && !game.isOver) {
          game.togglePause();
          const levelupScreen = document.getElementById('level-up-screen');
          if (levelupScreen.style.top === '43em' || levelupScreen.style.top === '') {
            levelupScreen.style.top = '2em';
          } else {
            levelupScreen.style.top = '43em';
          }
        }
      }
    });
  }
  gameScreen.style.display = 'block';
  game.player.element.style.top = `${gameScreen.offsetHeight / 2}px`;
  game.player.element.style.left = `${gameScreen.offsetWidth / 2}px`;
  homeScreen.style.display = 'none';
  playSound(buttonSelect);
});
mainMenuButton.addEventListener('click', () => {
  document.getElementById('game-over-screen').style.top = '43em';
  homeScreen.style.display = 'flex';
  gameScreen.style.display = 'none';
  playSound(buttonSelect);
});
confirmButton.addEventListener('click', () => {
  statUpgrades.confirmSkills();
  setPlusButtons();
  setMinusButtons();
  setConfirm();
  playSound(confirmSound);
  if (game.player.stats.adrenaline) game.HUD.adrenaline.style.width = '100%';
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
});
restartButton.addEventListener('click', () => {
  document.getElementById('game-over-screen').style.top = '43em';
  document.getElementById('level-up-screen').style.top = '43em';
  document.getElementById('game-win-screen').style.display = 'none';
  gameScreen.style.display = 'block';
  document.removeEventListener('keydown', game.eventHandlers.controls);
  document.removeEventListener('keyup', game.eventHandlers.controls);
  document.removeEventListener('remove-bullet', game.eventHandlers.handleBulletRemoval);
  game.HUD.topLevel.remove();
  Array.from(Object.keys(game.bullets)).forEach((item) => game.bullets[item].element.remove());
  Array.from(Object.keys(game.powerUps)).forEach((item) => game.powerUps[item].element.remove());
  game = new Game(document.getElementById('el'));
  statUpgrades = new LevelUpInterface(game.player);
  generateHUD();
  init();
  setPlusButtons();
  setMinusButtons();
  setConfirm();
  setLvlAndSkill();
  emptySkillBars();
  game.player.element.style.width = '40px';
  game.player.element.style.height = '40px';
  game.startGame();
  playSound(buttonSelect);
  gameMusic.currentTime = 0;
  if (musicAllowed) playSound(gameMusic);
});
muteButton.addEventListener('click', (e) => {
  if (gameMusic.paused) {
    musicAllowed = true;
    e.currentTarget.src = 'assets/musical-note-sharp.svg';
    gameMusic.volume = 0.2;
    gameMusic.play();
  } else {
    musicAllowed = false;
    e.currentTarget.src = 'assets/musical-note-sharp2.svg';
    gameMusic.pause();
    gameMusic.currentTime = 0;
  }
});

document.addEventListener('game-over', () => {
  gameMusic.pause();
  playSound(gameOverScratch);
  game.isOver = true;
  game.togglePause();
  document.getElementById('final-score').textContent = `Final Score: ${game.player.stats.experience}`;
  if (game.player.stats.experience >= LevelData.characterLevelUpBreakpoints.MAX) {
    document.getElementById('final-score').textContent = 'You\'ve somehow hit max score... You\'re a LEGEND!!!';
  }
  document.getElementById('bullets-survived').textContent = `Bullets Survived: ${game.bulletId}`;
  if (document.getElementById('game-over-screen').style.top === '43em'
  || document.getElementById('game-over-screen').style.top === '') {
    document.getElementById('game-over-screen').style.top = '14em';
  } else {
    document.getElementById('game-over-screen').style.top = '43em';
  }
});
document.addEventListener('game-win', () => {
  document.getElementById('game-win-screen').style.display = 'flex';
  game.isOver = true;
  game.player.isWinner = true;
});
document.addEventListener('level-up', () => {
  statUpgrades = new LevelUpInterface(game.player);
  setPlusButtons();
  setLvlAndSkill();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
  Object.keys(game.bullets).forEach((bullet) => {
    if (game.bullets[bullet]) document.dispatchEvent(game.bullets[bullet].removeBullet);
  });
  playSound(levelUpSound);
});

Array.from(document.getElementsByClassName('minus-button')).forEach((button) => {
  button.append(generateMinus());
  button.disabled = true;
  button.addEventListener('click', () => {
    statUpgrades.removePoint(button.dataset.skill);
    const bar = document.querySelector(`.skill-bar[data-skill=${button.dataset.skill}]`);
    bar.lastChild.remove();
    setMinusButtons();
    setPlusButtons();
    setLvlAndSkill();
    setConfirm();
    playSound(buttonSound);
  });
});
Array.from(document.getElementsByClassName('plus-button')).forEach((button) => {
  button.append(generatePlus());
  button.disabled = true;
  button.addEventListener('click', () => {
    statUpgrades.addPoint(button.dataset.skill);
    const bar = document.querySelector(`.skill-bar[data-skill=${button.dataset.skill}]`);
    switch (button.dataset.skill) {
      case 'maxHealth':
        bar.append(generateSkillBlock('red'));
        break;
      case 'armor':
        bar.append(generateSkillBlock('grey'));
        break;
      case 'speed':
        bar.append(generateSkillBlock('cyan'));
        break;
      case 'luck':
        bar.append(generateSkillBlock('green'));
        break;
      case 'adrenaline':
        bar.append(generateSkillBlock('magenta'));
        break;
      case 'size':
        bar.append(generateSkillBlock('orange'));
        break;
      default:
    }
    setPlusButtons();
    setMinusButtons();
    setLvlAndSkill();
    setConfirm();
    playSound(buttonSound);
  });
});
