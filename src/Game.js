class Game {
  constructor(area) {
    area.style.position = 'relative';
    this.player = new Character(area, document.getElementById('player'));
    this.bullets = {};
    this.powerUps = {};
    this.bulletId = 0;
    this.powerUpId = 0;
    this.area = area;
    this.paused = false;
    this.keyInput = {
      ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, ' ': false
    };
    document.addEventListener('remove-bullet', this.handleBulletRemoval.bind(this));
    this.initCharacterControl();
  }

  startGame() {
    this.spawnTick = setInterval(() => {
      this.spawnBullet();
    }, LevelData.bulletSpawnRates[this.player.stats.level - 1]);
    this.gameTick = setInterval(() => {
      this.moveBullets();
      this.movePlayer();
      this.spawnPowerUp();
    }, 10);
  }

  addHealthUnit() {
    const healthUnit = document.createElement('div');
    healthUnit.classList.add('health-unit');
    healthUnit.style.height = '1em';
    healthUnit.style.backgroundColor = 'red';
    healthUnit.style.margin = '0 0.1em 0 0.1em';
    this.HUD.health.append(healthUnit);
  }

  spawnPowerUp() {
    const randomNum = (Utils.randomizeRange(0, 10000) / 10000);
    const spawnChance = (this.player.stats.luck * (1 / 10000)) + (1 / 750);
    if (randomNum <= spawnChance) {
      const powerUpType = LevelData.getWeightedPowerUp();
      this.powerUps[this.powerUpId] = new PowerUp(this.area, powerUpType, this.powerUpId);
      this.powerUpId += 1;
    }
  }

  handlePlayerBulletCollision(bullet) {
    if (!this.player.invincible) {
      const randomNum = Math.random().toFixed(2);
      if (randomNum <= this.player.stats.armor * 0.07) {
        console.log('Armor has blocked damage!');
      } else {
        for (let i = 0; i < bullet.damage; i++) {
          this.player.stats.health -= 1;
          this.HUD.health.lastChild.remove();
          if (this.player.stats.health === 0) {
            this.togglePause();
            break;
          }
        }
      }
    } else {
      bullet.removeBullet.detail.score = true;
    }
    document.dispatchEvent(bullet.removeBullet);
  }

  handlePlayerPowerUpCollision(powerup) {
    document.dispatchEvent(powerup.despawnEvt);
    switch (powerup.type) {
      case 'Invincibility':
        if (this.player.powerUpTimers.invincibility.currentTimer) {
          this.player.powerUpTimers.invincibility.resetTimer();
        } else {
          this.player.invincible = true;
        }
        this.player.powerUpTimers.invincibility.startTimer();
        this.HUD.invinceSlot.cont.style.opacity = '1';
        break;
      case 'Speed':
        if (this.player.powerUpTimers.speed.currentTimer) {
          this.player.powerUpTimers.speed.resetTimer();
        } else {
          this.player.stats.speed += 1;
        }
        this.player.powerUpTimers.speed.startTimer();
        this.HUD.speedSlot.cont.style.opacity = '1';
        break;
      case 'Health':
        if (this.player.stats.health + 1 <= this.player.stats.maxHealth + 5) {
          this.player.stats.health += 1;
          this.addHealthUnit();
        } else {
          this.player.stats.experience += 10;
          LevelData.checkLevelUp(this.player);
          console.log('health full');
        }
        break;
      case 'Kaboom':
        Object.keys(this.bullets).forEach((bullet) => {
          this.togglePause();
          this.bullets[bullet].removeBullet.detail.score = true;
          document.dispatchEvent(this.bullets[bullet].removeBullet);
          this.togglePause();
        });
        break;
      case 'Experience':
        this.player.stats.experience += Math.floor(LevelData.characterLevelUpBreakpoints[this.player.stats.level - 1] * 0.075);
        LevelData.checkLevelUp(this.player);
        this.HUD.exp.textContent = `${this.player.stats.experience}/${LevelData.characterLevelUpBreakpoints[this.player.stats.level - 1]}`;
        break;
      default:
        console.log('Impossible!');
    }
  }

  handleBulletRemoval(e) {
    if (e.detail.score) {
      this.player.stats.experience += this.bullets[e.detail.key].damage;
      this.HUD.exp.textContent = `${this.player.stats.experience}/${LevelData.characterLevelUpBreakpoints[this.player.stats.level - 1]}`;
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
    });
  }

  movePlayer() {
    if (this.keyInput.ArrowUp) this.player.movePosY();
    if (this.keyInput.ArrowDown) this.player.moveNegY();
    if (this.keyInput.ArrowRight) this.player.movePosX();
    if (this.keyInput.ArrowLeft) this.player.moveNegX();
    if (this.keyInput[' '] && this.player.stats.adrenaline && !this.player.adrenalineCooldown.currentTimer) document.dispatchEvent(new CustomEvent('adrenaline-activated'));
    Object.keys(this.powerUps).forEach((powerup) => {
      if (Utils.checkCollision(this.player.element, this.powerUps[powerup].collisionRanges)) {
        this.powerUps[powerup].despawnTimer.pauseTimer();
        this.handlePlayerPowerUpCollision(this.powerUps[powerup]);
      }
    });
    Object.keys(this.bullets).forEach((bullet) => {
      if (this.bullets[bullet]) {
        if (Utils.checkCollision(this.player.element, this.bullets[bullet].collisionRanges)) {
          this.handlePlayerBulletCollision(this.bullets[bullet]);
        }
      }
    });
  }

  togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      clearInterval(this.spawnTick);
      clearInterval(this.gameTick);
      Object.keys(this.powerUps).forEach((powerup) => {
        this.powerUps[powerup].despawnTimer.pauseTimer();
      });
      Object.keys(this.player.powerUpTimers).forEach((powerup) => {
        if (this.player.powerUpTimers[powerup].currentTimer) {
          this.player.powerUpTimers[powerup].pauseTimer();
        }
      });
    } else {
      this.spawnTick = setInterval(() => {
        this.spawnBullet();
      }, LevelData.bulletSpawnRates[this.player.stats.level - 1]);
      this.gameTick = setInterval(() => {
        this.moveBullets();
        this.movePlayer();
        this.spawnPowerUp();
      }, 10);
      Object.keys(this.powerUps).forEach((powerup) => {
        this.powerUps[powerup].despawnTimer.startTimer();
      });
      Object.keys(this.player.powerUpTimers).forEach((powerup) => {
        if (this.player.powerUpTimers[powerup].currentTimer) {
          this.player.powerUpTimers[powerup].startTimer();
        }
      });
    }
  }
}
