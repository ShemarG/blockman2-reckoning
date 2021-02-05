class Utils {
  static randomizeRange(floor, ceil) {
    return Math.floor(Math.random() * ceil) + floor;
  }

  static calculateCollisonRanges(el) {
    return {
      collMinX: el.offsetLeft - el.offsetWidth,
      collMaxX: el.offsetLeft + el.offsetWidth,
      collMinY: el.offsetTop - el.offsetHeight,
      collMaxY: el.offsetTop + el.offsetHeight
    };
  }
}
