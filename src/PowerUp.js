class PowerUp {
  constructor(boundingEl, type, key) {
    this.element = LevelData.powerupElGen(type);
    this.despawnEvt = new CustomEvent('despawnTimer', { detail: { key } });
    this.despawnTimer = new Timer(10, null, null, this.despawnEvt);
    this.spawn(this.element, boundingEl);
    this.collisionRanges = Utils.calculateCollisonRanges(this.element);
    this.despawnTimer.startTimer();
  }

  spawn(el, boundingEl) {
    const coords = Utils.calculateSpawn(el, boundingEl);
    console.log('x', coords.x, 'y', coords.y);
    el.style.top = `${coords.y}px`;
    el.style.left = `${coords.x}px`;
    boundingEl.append(el);
  }
}
