class Utils {
  static randomizeRange(floor, ceil) {
    return Math.floor(Math.random() * ceil) + floor;
  }

  static inRange(num, min, max) {
    if (num >= min && num < max) return true;
    return false;
  }

  static calculateCollisonRanges(el) {
    return {
      collMinX: el.offsetLeft,
      collMaxX: el.offsetLeft + el.offsetWidth,
      collMinY: el.offsetTop,
      collMaxY: el.offsetTop + el.offsetHeight
    };
  }

  static checkCollision(el, ranges) {
    const topEdge = el.offsetTop;
    const bottomEdge = el.offsetTop + el.offsetHeight;
    const leftEdge = el.offsetLeft;
    const rightEdge = el.offsetLeft + el.offsetWidth;

    if (this.inRange(topEdge, ranges.collMinY, ranges.collMaxY)) {
      if (this.inRange(leftEdge, ranges.collMinX, ranges.collMaxX)) return true;
      if (this.inRange(rightEdge, ranges.collMinX, ranges.collMaxX)) return true;
      if (this.inRange(ranges.collMinX, leftEdge, rightEdge)) return true;
      if (this.inRange(ranges.collMaxX, leftEdge, rightEdge)) return true;
    }
    if (this.inRange(bottomEdge, ranges.collMinY, ranges.collMaxY)) {
      if (this.inRange(leftEdge, ranges.collMinX, ranges.collMaxX)) return true;
      if (this.inRange(rightEdge, ranges.collMinX, ranges.collMaxX)) return true;
      if (this.inRange(ranges.collMinX, leftEdge, rightEdge)) return true;
      if (this.inRange(ranges.collMaxX, leftEdge, rightEdge)) return true;
    }
    if (this.inRange(leftEdge, ranges.collMinX, ranges.collMaxX)) {
      if (this.inRange(topEdge, ranges.collMinY, ranges.collMaxY)) return true;
      if (this.inRange(bottomEdge, ranges.collMinY, ranges.collMaxY)) return true;
      if (this.inRange(ranges.collMinY, topEdge, bottomEdge)) return true;
      if (this.inRange(ranges.collMaxY, topEdge, bottomEdge)) return true;
    }
    if (this.inRange(rightEdge, ranges.collMinX, ranges.collMaxX)) {
      if (this.inRange(topEdge, ranges.collMinY, ranges.collMaxY)) return true;
      if (this.inRange(bottomEdge, ranges.collMinY, ranges.collMaxY)) return true;
      if (this.inRange(ranges.collMinY, topEdge, bottomEdge)) return true;
      if (this.inRange(ranges.collMaxY, topEdge, bottomEdge)) return true;
    }
  }
}
