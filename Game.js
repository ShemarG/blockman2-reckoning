class Game {
  constructor(area) {
    area.style.position = 'relative';
    this.player = new Character(area, document.getElementById('player'));
    this.bullets = {};
    this.bulletId = 0;
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
    document.addEventListener('remove-bullet', this.handleBulletRemoval.bind(this));
    this.initCharacterControl();
  }

  handleBulletRemoval(e) {
    console.log(e.detail.key, this.bullets[e.detail.key]);
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
    const possibleSides = ['top', 'bottom', 'left', 'right'];
    const chosenSide = possibleSides[Utils.randomizeRange(0, possibleSides.length)];
    const bullet = new Bullet(this.area, chosenSide, this.levelData.enemyRadius, this.levelData.enemySpeed, this.bulletId);
    this.bullets[this.bulletId] = bullet;
    this.bulletId += 1;
    return bullet;
  }

  moveBullets() {
    Object.keys(this.bullets).forEach((bullet) => {
      this.bullets[bullet].move();
      if (this.bullets[bullet]) Utils.checkCollision(this.player.element, this.bullets[bullet].collisionRanges);
    });
  }

  movePlayer() {
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
