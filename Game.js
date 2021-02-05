class Game {
  constructor(area) {
    this.bullets = [];
    this.area = area;
    this.levelData = {
      enemySpeed: 1,
      enemyRadius: 20
    };
    this.gameTick = setInterval(() => {
      this.moveBullets();
    }, 10);
    this.spawnTick = setInterval(() => {
      this.spawnBullet();
    }, 1000);
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
}
