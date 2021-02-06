class Utils {
  static randomizeRange(floor, ceil) {
    return Math.floor(Math.random() * ceil) + floor;
  }

  static calculateCollisonRanges(el) {
    return {
      collMinX: el.offsetLeft,
      collMaxX: el.offsetLeft + el.offsetWidth,
      collMinY: el.offsetTop,
      collMaxY: el.offsetTop + el.offsetHeight
    };
  }
}
