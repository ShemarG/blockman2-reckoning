class Character {
  constructor(boundingEl, element, color = 'red', level = 1) {
    this.boundingEl = boundingEl;
    this.element = element;
    this.baseSize = this.element.offsetWidth;
    this.stats = {
      level,
      maxHealth: 0,
      health: 10,
      armor: 5,
      speed: 0,
      luck: 5,
      adrenaline: 0,
      size: 0,
      skillPoints: 0,
      experience: 0
    };
    this.powerUpTimers = {
      invincibility: new Timer(10, this.powerUpTick, 'Invincibility', new CustomEvent('invincibility-over')),
      speed: new Timer(10, this.powerUpTick, 'Speed', new CustomEvent('speed-over'))
    };
    this.invincible = false;
    this.enabled = true;
    this.element.style.backgroundColor = color;
    this.element.style.position = 'absolute';
    this.element.style.top = `${boundingEl.offsetHeight / 2}px`;
    this.element.style.left = `${boundingEl.offsetWidth / 2}px`;
    this.changeSize();
  }

  changeSize() {
    this.element.style.height = `${this.baseSize * (1 - (this.stats.size / 10))}px`;
    this.element.style.width = `${this.baseSize * (1 - (this.stats.size / 10))}px`;
  }

  // Movement functions.
  movePosX() {
    const displacedPos = this.element.offsetLeft + ((this.stats.speed * 0.8) + 1);
    if (this.enabled && displacedPos < (this.boundingEl.offsetWidth - this.element.offsetWidth)) this.element.style.left = `${displacedPos}px`;
    Utils.calculateCollisonRanges(this.element);
  }

  moveNegX() {
    const displacedPos = this.element.offsetLeft - ((this.stats.speed * 0.8) + 1);
    if (this.enabled && displacedPos > 0) this.element.style.left = `${displacedPos}px`;
    Utils.calculateCollisonRanges(this.element);
  }

  movePosY() {
    const displacedPos = this.element.offsetTop - ((this.stats.speed * 0.8) + 1);
    if (this.enabled && displacedPos > 0) this.element.style.top = `${displacedPos}px`;
    Utils.calculateCollisonRanges(this.element);
  }

  moveNegY() {
    const displacedPos = this.element.offsetTop + ((this.stats.speed * 0.8) + 1);
    if (this.enabled && displacedPos < (this.boundingEl.offsetHeight - this.element.offsetHeight)) this.element.style.top = `${displacedPos}px`;
    Utils.calculateCollisonRanges(this.element);
  }

  powerUpTick() {
    document.dispatchEvent(new CustomEvent('powerup-tick', { detail: { type: this.callbackArg, val: this.timeLeft } }));
  }
}
