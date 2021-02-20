class Character {
  constructor(boundingEl, element, color = 'red') {
    this.boundingEl = boundingEl;
    this.element = element;
    this.baseSize = 40;
    this.stats = {
      level: 0,
      maxHealth: 0,
      health: 5,
      armor: 0,
      speed: 0,
      luck: 0,
      adrenaline: 0,
      size: 0,
      skillPoints: 0,
      experience: 0
    };
    this.perks = [];
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
    this.isWinner = false;
  }

  setAdrenaline() {
    this.powerUpTimers.adrenaline = new Timer(this.stats.adrenaline, this.powerUpTick, 'Adrenaline', new CustomEvent('adrenaline-over'));
    this.adrenalineCooldown = new Timer((this.stats.adrenaline ** 2 + 5), this.powerUpTick, 'Adrenaline-Recharge', new CustomEvent('adrenaline-recharged'));
  }

  syncStats() {
    if (this.stats.adrenaline) this.setAdrenaline();
    this.element.style.height = `${this.baseSize * (1 - (this.stats.size / 10))}px`;
    this.element.style.width = `${this.baseSize * (1 - (this.stats.size / 10))}px`;
    this.stats.maxHealth === 5 && !(this.perks.includes('Healthy')) ? this.perks.push('Healthy') : null;
    this.stats.armor === 5 && !(this.perks.includes('Aegis')) ? this.perks.push('Aegis') : null;
    this.stats.speed === 5 && !(this.perks.includes('C-Speed')) ? this.perks.push('C-Speed') : null;
    this.stats.luck === 5 && !(this.perks.includes('Fortunate')) ? this.perks.push('Fortunate') : null;
    this.stats.adrenaline === 5 && !(this.perks.includes('Reflexes')) ? this.perks.push('Reflexes') : null;
    this.stats.size === 5 && !(this.perks.includes('Relativity')) ? this.perks.push('Relativity') : null;
    document.dispatchEvent(new CustomEvent('check-perks'));
  }

  // Movement functions.
  movePosX() {
    const displacedPos = parseFloat(this.element.style.left) + ((this.stats.speed * 0.6) + (this.powerUpTimers.speed.currentTimer ? 2 : 1));
    if (this.enabled && displacedPos < (this.boundingEl.offsetWidth - this.element.offsetWidth)) this.element.style.left = `${displacedPos}px`;
  }

  moveNegX() {
    const displacedPos = parseFloat(this.element.style.left) - ((this.stats.speed * 0.6) + (this.powerUpTimers.speed.currentTimer ? 2 : 1));
    if (this.enabled && displacedPos > 0) this.element.style.left = `${displacedPos}px`;
  }

  movePosY() {
    const displacedPos = parseFloat(this.element.style.top) - ((this.stats.speed * 0.6) + (this.powerUpTimers.speed.currentTimer ? 2 : 1));
    if (this.enabled && displacedPos > 0) this.element.style.top = `${displacedPos}px`;
  }

  moveNegY() {
    const displacedPos = parseFloat(this.element.style.top) + ((this.stats.speed * 0.6) + (this.powerUpTimers.speed.currentTimer ? 2 : 1));
    if (this.enabled && displacedPos < (this.boundingEl.offsetHeight - this.element.offsetHeight)) this.element.style.top = `${displacedPos}px`;
  }

  powerUpTick() {
    document.dispatchEvent(new CustomEvent('powerup-tick', { detail: { type: this.callbackArg, val: this.timeLeft } }));
  }
}
