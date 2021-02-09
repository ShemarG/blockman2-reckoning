class PowerUp {
  constructor(boundingEl, type, key) {
    this.type = type;
    this.element = LevelData.powerupElGen(type);
    this.despawnEvt = new CustomEvent('despawn-powerup', { detail: { key } });
    this.despawnTimer = new Timer(10, null, null, this.despawnEvt);
    this.spawn(this.element, boundingEl);
    this.collisionRanges = Utils.calculateCollisonRanges(this.element);
    this.despawnTimer.startTimer();
  }

  spawn(el, boundingEl) {
    const coords = Utils.calculateSpawn(el, boundingEl);
    el.style.top = `${coords.y}px`;
    el.style.left = `${coords.x}px`;
    boundingEl.append(el);
  }
}
