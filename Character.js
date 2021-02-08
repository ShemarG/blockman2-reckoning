class Character {
  constructor(boundingEl, element, color = 'red', level = 1) {
    this.boundingEl = boundingEl;
    this.element = element;
    this.stats = {
      level,
      maxHealth: 5,
      health: 5,
      armor: 0,
      speed: 1,
      luck: 0,
      adrenaline: 0,
      experience: 0
    };
    this.enabled = true;
    this.element.style.backgroundColor = color;
    this.element.style.position = 'absolute';
    this.element.style.top = `${boundingEl.offsetHeight / 2}px`;
    this.element.style.left = `${boundingEl.offsetWidth / 2}px`;
  }

  // Movement functions.
  movePosX() {
    const displacedPos = this.element.offsetLeft + this.stats.speed;
    if (this.enabled && displacedPos < (this.boundingEl.offsetWidth - this.element.offsetWidth)) this.element.style.left = `${displacedPos}px`;
    Utils.calculateCollisonRanges(this.element);
  }

  moveNegX() {
    const displacedPos = this.element.offsetLeft - this.stats.speed;
    if (this.enabled && displacedPos > 0) this.element.style.left = `${displacedPos}px`;
    Utils.calculateCollisonRanges(this.element);
  }

  movePosY() {
    const displacedPos = this.element.offsetTop - this.stats.speed;
    if (this.enabled && displacedPos > 0) this.element.style.top = `${displacedPos}px`;
    Utils.calculateCollisonRanges(this.element);
  }

  moveNegY() {
    const displacedPos = this.element.offsetTop + this.stats.speed;
    if (this.enabled && displacedPos < (this.boundingEl.offsetHeight - this.element.offsetHeight)) this.element.style.top = `${displacedPos}px`;
    Utils.calculateCollisonRanges(this.element);
  }
}
