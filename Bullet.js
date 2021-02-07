class Bullet {
  constructor(boundingEl, side, radius, speed, key) {
    this.boundingEl = boundingEl;
    this.element = document.createElement('div');
    this.speed = speed;
    this.element.style.position = 'absolute';
    this.element.style.zIndex = '1';
    this.element.style.backgroundColor = 'blue';
    this.element.style.width = `${2 * radius}px`;
    this.element.style.height = `${2 * radius}px`;
    this.element.style.borderRadius = `${2 * radius}px`;
    this.direction = this.spawn(side);
    this.removeBullet = new CustomEvent('remove-bullet', { detail: { key } });
  }

  move() {
    const yPos = this.element.offsetTop;
    const xPos = this.element.offsetLeft;
    if (this.direction === 'up') {
      if (yPos > (-1 * this.element.offsetHeight)) {
        this.element.style.top = `${yPos - this.speed}px`;
      } else {
        document.dispatchEvent(this.removeBullet);
      }
    }
    if (this.direction === 'down') {
      if (yPos < (this.boundingEl.offsetHeight)) {
        this.element.style.top = `${yPos + this.speed}px`;
      } else {
        document.dispatchEvent(this.removeBullet);
      }
    }
    if (this.direction === 'left') {
      if (xPos > (-1 * this.element.offsetWidth)) {
        this.element.style.left = `${xPos - this.speed}px`;
      } else {
        document.dispatchEvent(this.removeBullet);
      }
    }
    if (this.direction === 'right') {
      if (xPos < (this.boundingEl.offsetWidth)) {
        this.element.style.left = `${xPos + this.speed}px`;
      } else {
        document.dispatchEvent(this.removeBullet);
      }
    }
    this.collisionRanges = Utils.calculateCollisonRanges(this.element);
  }

  spawn(side) {
    const width = this.boundingEl.offsetWidth;
    const height = this.boundingEl.offsetHeight;
    // This is apparently faster than parseInt/parseFloat: https://stackoverflow.com/questions/4860244/how-to-delete-px-from-245px/4860249
    const bulletWidth = Number(this.element.style.width
      .substring(0, this.element.style.width.length - 2));
    const bulletHeight = Number(this.element.style.height
      .substring(0, this.element.style.height.length - 2));
    if (side === 'top') {
      this.element.style.top = `-${bulletHeight}px`;
      this.element.style.left = `${Utils.randomizeRange(0, (width - bulletWidth))}px`;
      this.boundingEl.append(this.element);
      return 'down';
    }
    if (side === 'bottom') {
      this.element.style.top = `${height}px`;
      this.element.style.left = `${Utils.randomizeRange(0, (width - bulletWidth))}px`;
      this.boundingEl.append(this.element);
      return 'up';
    }
    if (side === 'left') {
      this.element.style.top = `${Utils.randomizeRange(0, (height - bulletHeight))}px`;
      this.element.style.left = `-${bulletWidth}px`;
      this.boundingEl.append(this.element);
      return 'right';
    }
    if (side === 'right') {
      this.element.style.top = `${Utils.randomizeRange(0, (height - bulletHeight))}px`;
      this.element.style.left = `${width}px`;
      this.boundingEl.append(this.element);
      return 'left';
    }
  }
}
