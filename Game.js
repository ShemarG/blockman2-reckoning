class Game {
  constructor(area) {
    this.player = new Character(area, document.getElementById('player'));
    this.bullets = [];
    this.area = area;
    this.levelData = {
      enemySpeed: 1,
      enemyRadius: 20,
      enemySpawnRate: 1000
    };
    this.paused = true;
    this.keyInput = {
      ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false
    };
    this.initCharacterControl();
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
    const possibleSides = ['top', 'bottom', 'left', 'right'];
    const chosenSide = possibleSides[Utils.randomizeRange(0, possibleSides.length)];
    const bullet = new Bullet(this.area, chosenSide, this.levelData.enemyRadius, this.levelData.enemySpeed);
    this.bullets.push(bullet);
    return bullet;
  }

  moveBullets() {
    this.bullets.forEach((bullet) => {
      bullet.move();
    });
  }

  movePlayer() {
    console.log('in move player');
    if (this.keyInput.ArrowUp) this.player.movePosY();
    if (this.keyInput.ArrowDown) this.player.moveNegY();
    if (this.keyInput.ArrowRight) this.player.movePosX();
    if (this.keyInput.ArrowLeft) this.player.moveNegX();
  }

  togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      clearInterval(this.spawnTick);
      clearInterval(this.gameTick);
    } else {
      this.spawnTick = setInterval(() => {
        this.spawnBullet();
      }, this.levelData.enemySpawnRate);
      this.gameTick = setInterval(() => {
        this.moveBullets();
        this.movePlayer();
      }, 10);
    }
  }
}
