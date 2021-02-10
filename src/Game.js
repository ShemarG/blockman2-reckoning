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
    const spawnChance = (this.player.stats.luck * (1 / 10000)) + (1 / 1250);
    if (randomNum <= spawnChance) {
      const powerUpType = LevelData.getWeightedPowerUp();
      if (this.player.perks.includes('Fortunate')) {
        const secondPowerUp = LevelData.getWeightedPowerUp();
        this.powerUps[this.powerUpId] = new PowerUp(this.area, secondPowerUp, this.powerUpId);
        this.powerUpId += 1;
      }
      this.powerUps[this.powerUpId] = new PowerUp(this.area, powerUpType, this.powerUpId);
      this.powerUpId += 1;
    }
  }

  handlePlayerBulletCollision(bullet) {
    if (this.player.perks.includes('Reflexes')) {
      if (this.player.adrenalineCooldown.currentTimer
        && this.player.adrenalineCooldown.timeLeft >= 5) {
        this.player.adrenalineCooldown.timeLeft -= 5;
        this.HUD.adrenaline.style.webkitTransition = '';
        this.HUD.adrenaline.style.width = `${((this.player.adrenalineCooldown.initialDuration
          - this.player.adrenalineCooldown.timeLeft) / this.player.adrenalineCooldown.initialDuration) * 100}%`;
        setTimeout(() => {
          this.HUD.adrenaline.style.webkitTransition = `width ${this.player.adrenalineCooldown.timeLeft + 1}s linear`;
          this.HUD.adrenaline.style.width = '100%';
        }, 1);
      }
    }
    if (!this.player.invincible) {
      const randomNum = Math.random().toFixed(2);
      if (randomNum <= this.player.stats.armor * 0.07) {
        console.log('Armor has blocked damage!');
      } else {
        if (this.player.perks.includes('Aegis')) {
          bullet.damage -= 1;
        }
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
        if (this.player.perks.includes('C-Speed') && !this.player.powerUpTimers.invincibility.currentTimer) {
          this.player.invincible = true;
        }
        if (this.player.powerUpTimers.speed.currentTimer) {
          this.player.powerUpTimers.speed.resetTimer();
        } else {
          this.player.stats.speed += 1;
        }
        this.player.powerUpTimers.speed.startTimer();
        this.HUD.speedSlot.cont.style.opacity = '1';
        break;
      case 'Health':
        if (this.player.perks.includes('Healthy')) {
          if (this.player.stats.health + 2 <= this.player.stats.maxHealth + 5) {
            this.player.stats.health += 1;
            this.player.stats.health += 1;
            this.addHealthUnit();
            this.addHealthUnit();
          } else if (this.player.stats.health + 1 <= this.player.stats.maxHealth + 5) {
            this.player.stats.health += 1;
            this.addHealthUnit();
            this.player.stats.experience += Math.floor(LevelData.characterLevelUpBreakpoints[this.player.stats.level - 1] * 0.05);
          } else {
            this.player.stats.experience += Math.floor(LevelData.characterLevelUpBreakpoints[this.player.stats.level - 1] * 0.05);
            this.player.stats.experience += Math.floor(LevelData.characterLevelUpBreakpoints[this.player.stats.level - 1] * 0.05);
          }
        } else if (this.player.stats.health + 1 <= this.player.stats.maxHealth + 5) {
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
    const bulletSize = this.player.perks.includes('Relativity')
      ? Math.floor(LevelData.bulletConfigs[bulletType].radius * 0.7)
      : LevelData.bulletConfigs[bulletType].radius;
    const bullet = new Bullet(
      this.area,
      chosenSide,
      bulletSize,
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
      if (this.player.adrenalineCooldown && this.player.adrenalineCooldown.currentTimer) {
        this.player.adrenalineCooldown.pauseTimer();
        const temp = window.getComputedStyle(this.HUD.adrenaline).width;
        this.HUD.adrenaline.style.webkitTransition = '';
        this.HUD.adrenaline.style.width = temp;
      }
      Object.keys(this.powerUps).forEach((powerup) => {
        this.powerUps[powerup].despawnTimer.pauseTimer();
      });
      Object.keys(this.player.powerUpTimers).forEach((powerup) => {
        if (this.player.powerUpTimers[powerup].currentTimer) {
          this.player.powerUpTimers[powerup].pauseTimer();
          if (powerup === 'adrenaline') {
            const temp = window.getComputedStyle(this.HUD.adrenaline).width;
            this.HUD.adrenaline.style.webkitTransition = '';
            this.HUD.adrenaline.style.width = temp;
          }
        }
      });
    } else {
      if (!this.player.powerUpTimers.adrenaline.currentTimer) {
        this.spawnTick = setInterval(() => {
          this.spawnBullet();
        }, LevelData.bulletSpawnRates[this.player.stats.level - 1]);
        this.gameTick = setInterval(() => {
          this.moveBullets();
          this.movePlayer();
          this.spawnPowerUp();
        }, 10);
      } else {
        this.gameTick = setInterval(() => {
          this.movePlayer();
          this.spawnPowerUp();
        }, 10);
      }
      if (this.player.adrenalineCooldown && this.player.adrenalineCooldown.currentTimer) {
        this.player.adrenalineCooldown.startTimer();
        this.HUD.adrenaline.style.webkitTransition = `width ${this.player.adrenalineCooldown.timeLeft + 1}s linear`;
        this.HUD.adrenaline.style.width = '100%';
      }
      Object.keys(this.powerUps).forEach((powerup) => {
        this.powerUps[powerup].despawnTimer.startTimer();
      });
      Object.keys(this.player.powerUpTimers).forEach((powerup) => {
        if (this.player.powerUpTimers[powerup].currentTimer) {
          if (powerup === 'adrenaline') {
            this.HUD.adrenaline.style.webkitTransition = `width ${this.player.powerUpTimers.adrenaline.timeLeft + 1}s linear`;
            this.HUD.adrenaline.style.width = '0%';
          }
          this.player.powerUpTimers[powerup].startTimer();
        }
      });
    }
  }
}
