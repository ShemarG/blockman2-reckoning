class Game {
  constructor(area) {
    area.style.position = 'relative';
    this.player = new Character(area, document.getElementById('player'));
    this.bullets = {};
    this.powerUps = {};
    this.bulletId = 0;
    this.powerUpId = 0;
    this.area = area;
    this.adrenaline = {
      ready: false,
      cooldownTimer: new Timer((this.player.stats.adrenaline ** 2 + 5), this.adrenalineTimerTick, this, 'adrenaline-recharge')
    };
    this.adrenalineTimerTick.bind(this.adrenaline.cooldownTimer)();
    this.paused = true;
    this.keyInput = {
      ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, ' ': false
    };
    document.addEventListener('remove-bullet', this.handleBulletRemoval.bind(this));
    document.addEventListener('adrenaline-recharge', this.resetAdrenaline.bind(this));
    document.addEventListener('level-up', this.levelUp.bind(this));
    this.initCharacterControl();
    this.generateHUD();
  }

  spawnPowerUp() {
    const randomNum = (Utils.randomizeRange(0, 10000) / 10000);
    const spawnChance = (this.player.stats.luck * (1 / 10000)) + (1 / 2000);
    if (randomNum <= spawnChance) {
      const powerUpType = LevelData.getWeightedPowerUp();
      this.powerUps[this.powerUpId] = new PowerUp(this.area, powerUpType, this.powerUpId);
      this.powerUpId += 1;
    }
  }

  levelUp() {
    const up = new LevelUpInterface(this.player);
    up.confirmSkills();
    console.log('level-up fired', this.player.stats.level);
  }

  adrenalineTimerTick() {
    console.log(this.timeLeft, this.callbackArg.adrenaline.ready);
  }

  resetAdrenaline() {
    this.adrenaline.ready = true;
    this.adrenaline.cooldownTimer.initialDuration = this.player.stats.adrenaline ** 2 + 5;
    this.adrenaline.cooldownTimer.resetTimer();
  }

  activateAdrenaline() {
    this.adrenaline.ready = false;
    clearInterval(this.gameTick);
    this.gameTick = setInterval(() => {
      this.movePlayer();
    }, 10);
    setTimeout(() => {
      clearInterval(this.gameTick);
      this.gameTick = setInterval(() => {
        this.moveBullets();
        this.movePlayer();
      }, 10);
      this.adrenaline.cooldownTimer.startTimer();
    }, 1000 * this.player.stats.adrenaline);
  }

  generateHUD() {
    this.HUD = {};
    const healthBar = document.createElement('div');
    healthBar.style.position = 'absolute';
    healthBar.style.display = 'flex';
    healthBar.style.height = '2em';
    healthBar.style.color = 'white';
    const label = document.createElement('span');
    label.textContent = 'Health';
    label.style.fontFamily = 'Goldman';
    healthBar.append(label);
    const bar = document.createElement('div');
    bar.style.display = 'flex';
    this.HUD.health = bar;
    for (let i = 0; i < this.player.stats.health; i++) this.addHealthUnit();
    healthBar.append(bar);
    this.area.append(healthBar);
    const pause = document.createElement('span');
    pause.innerText = 'Pause';
    pause.style.fontFamily = 'Goldman';
    pause.style.marginLeft = '38em';
    pause.style.color = 'white';
    this.area.append(pause);
    pause.addEventListener('click', () => {
      if (pause.innerText === 'Pause' && this.player.stats.health !== 0) {
        debugger;
        pause.innerText = 'Resume';
        this.togglePause();
      } else if (pause.innerText === 'Resume' && this.player.stats.health !== 0) {
        pause.innerText = 'Pause';
        this.togglePause();
      }
    });
  }

  handlePlayerBulletCollision(bullet) {
    console.log(`${bullet.damage} Damage taken!`);
    document.dispatchEvent(bullet.removeBullet);
    for (let i = 0; i < bullet.damage; i++) {
      this.player.stats.health -= 1;
      this.HUD.health.lastChild.remove();
      if (this.player.stats.health === 0) {
        this.togglePause();
        break;
      }
    }
  }

  addHealthUnit() {
    const healthUnit = document.createElement('div');
    healthUnit.style.width = '1em';
    healthUnit.style.height = '1em';
    healthUnit.style.backgroundColor = 'red';
    healthUnit.style.margin = '0 0.1em 0 0.1em';
    this.HUD.health.append(healthUnit);
  }

  handleBulletRemoval(e) {
    if (e.detail.score) {
      this.player.stats.experience += this.bullets[e.detail.key].damage;
      LevelData.checkLevelUp(this.player);
    }
    this.bullets[e.detail.key].element.remove();
    delete this.bullets[e.detail.key];
  }

  initCharacterControl() {
    document.addEventListener('keydown', this.controls.bind(this));
    document.addEventListener('keyup', this.controls.bind(this));
  }

  controls(e) {
    e.preventDefault();
    if (e.type === 'keydown') {
      e.key in this.keyInput ? this.keyInput[e.key] = true : null;
    } else {
      e.key in this.keyInput ? this.keyInput[e.key] = false : null;
    }
  }

  spawnBullet() {
    const { level } = this.player.stats;
    const bulletType = LevelData.getWeightedBullet(level);
    const possibleSides = ['top', 'bottom', 'left', 'right'];
    const chosenSide = possibleSides[Utils.randomizeRange(0, possibleSides.length)];
    const bullet = new Bullet(
      this.area,
      chosenSide,
      LevelData.bulletConfigs[bulletType].radius,
      LevelData.bulletConfigs[bulletType].speed,
      LevelData.bulletConfigs[bulletType].damage,
      this.bulletId
    );
    this.bullets[this.bulletId] = bullet;
    this.bulletId += 1;
    return bullet;
  }

  moveBullets() {
    Object.keys(this.bullets).forEach((bullet) => {
      this.bullets[bullet].move();
      if (this.bullets[bullet]) {
        if (Utils.checkCollision(this.player.element, this.bullets[bullet].collisionRanges)) {
          this.handlePlayerBulletCollision(this.bullets[bullet]);
        }
      }
    });
  }

  movePlayer() {
    if (this.keyInput.ArrowUp) this.player.movePosY();
    if (this.keyInput.ArrowDown) this.player.moveNegY();
    if (this.keyInput.ArrowRight) this.player.movePosX();
    if (this.keyInput.ArrowLeft) this.player.moveNegX();
    if (this.keyInput[' '] && this.adrenaline.ready) this.activateAdrenaline();
  }

  togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      clearInterval(this.spawnTick);
      clearInterval(this.gameTick);
    } else {
      this.spawnTick = setInterval(() => {
        this.spawnBullet();
      }, LevelData.bulletSpawnRates[this.player.stats.level - 1]);
      this.gameTick = setInterval(() => {
        this.moveBullets();
        this.movePlayer();
        this.spawnPowerUp();
      }, 10);
    }
  }
}
