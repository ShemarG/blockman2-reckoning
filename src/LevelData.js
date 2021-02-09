class LevelData {
  static levelUpEvt = new CustomEvent('level-up')

  static skillPointGates = {
    maxHealth: {
      6: 1,
      7: 5,
      8: 8,
      9: 11,
      10: 13
    },
    armor: {
      1: 1,
      2: 4,
      3: 12,
      4: 15,
      5: 18,
    },
    speed: {
      1: 1,
      2: 6,
      3: 13,
      4: 16,
      5: 19
    },
    luck: {
      1: 1,
      2: 2,
      3: 9,
      4: 14,
      5: 17
    },
    adrenaline: {
      1: 1,
      2: 5,
      3: 10,
      4: 15,
      5: 20
    }
  }

  static characterLevelUpBreakpoints = [
    10,
    20,
    30,
    200,
    250,
    350,
    400,
    450,
    500,
    550,
    600,
    650,
    700,
    750,
    800,
    850,
    900,
    950,
    1000,
    1050,
  ]

  static bulletWeights = {
    1: {
      lv1: [0.00, 1.00], lv2: [-1, -1], lv3: [-1, -1], lv4: [-1, -1], lv5: [-1, -1]
    },
    2: {
      lv1: [0.05, 1.00], lv2: [0, 0.05], lv3: [-1, -1], lv4: [-1, -1], lv5: [-1, -1]
    },
    3: {
      lv1: [0.10, 1.00], lv2: [0, 0.10], lv3: [-1, -1], lv4: [-1, -1], lv5: [-1, -1]
    },
    4: {
      lv1: [0.15, 1.00], lv2: [0, 0.15], lv3: [-1, -1], lv4: [-1, -1], lv5: [-1, -1]
    },
    5: { // 1-0.2 = .8        0.2-0.05 = .15     0.05-0 = .05
      lv1: [0.20, 1.00], lv2: [0.05, 0.20], lv3: [0.00, 0.05], lv4: [-1, -1], lv5: [-1, -1]
    },
    6: { // 1-0.25 = .75      0.25-0.05 = .2     0.05-0 = .05
      lv1: [0.25, 1.00], lv2: [0.05, 0.25], lv3: [0.00, 0.05], lv4: [-1, -1], lv5: [-1, -1]
    },
    7: { // 1-0.3 = .7        0.3-0.1 = .2       0.1-0 = .1
      lv1: [0.03, 1.00], lv2: [0.10, 0.30], lv3: [0.00, 0.10], lv4: [-1, -1], lv5: [-1, -1]
    },
    8: { // 1-0.35 = .65      0.35-0.1 = .25     0.1-0 = .1
      lv1: [0.35, 1.00], lv2: [0.35, 0.10], lv3: [0.00, 0.10], lv4: [-1, -1], lv5: [-1, -1]
    },
    9: { // 1-0.4 = .6        0.4-0.15 = .25     0.15-0 = .15
      lv1: [0.40, 1.00], lv2: [0.15, 0.40], lv3: [0.00, 0.15], lv4: [-1, -1], lv5: [-1, -1]
    },
    10: { // 1-0.45 = .55     0.45-0.2 = .25     0.2-0.05 = .15     0.05-0 = .05
      lv1: [0.45, 1.00], lv2: [0.20, 0.45], lv3: [0.05, 0.20], lv4: [0.00, 0.05], lv5: [-1, -1]
    },
    11: { // 1-0.5 = .5       0.5-0.25 = .25     0.25-0.1 = .15     0.1-0 = .1
      lv1: [0.50, 1.00], lv2: [0.25, 0.50], lv3: [0.10, 0.25], lv4: [0.00, 0.10], lv5: [-1, -1]
    },
    12: { // 1-0.55 = .45     0.55-0.3 = .25     0.3-0.1 = .2       0.1-0 = .1
      lv1: [0.55, 1.00], lv2: [0.30, 0.55], lv3: [0.10, 0.30], lv4: [0.00, 0.10], lv5: [-1, -1]
    },
    13: { // 1-0.6 = .4       0.6-0.35 = .25     0.35-0.15 = .2     0.15-0 = .15
      lv1: [0.60, 1.00], lv2: [0.35, 0.60], lv3: [0.15, 0.35], lv4: [0.00, 0.15], lv5: [-1, -1]
    },
    14: { // 1-0.65 = .35     0.65-0.4 = .25     0.4-0.2 = .2       0.2-0 = .2
      lv1: [0.65, 1.00], lv2: [0.40, 0.65], lv3: [0.20, 0.40], lv4: [0.00, 0.20], lv5: [-1, -1]
    },
    15: { // 1-0.7 = .3       0.7-0.45 = .25     0.45-0.25 = .2     0.25-0.05 = .2     0.05-0 = .05
      lv1: [0.70, 1.00], lv2: [0.45, 0.70], lv3: [0.25, 0.45], lv4: [0.05, 0.25], lv5: [0.00, 0.05]
    },
    16: { // 1-0.75 = .25     0.75-0.5 = .25     0.5-0.3 = .2       0.3-0.1 = .2       0.1-0 = .1
      lv1: [0.75, 1.00], lv2: [0.50, 0.75], lv3: [0.30, 0.50], lv4: [0.10, 0.30], lv5: [0.00, 0.10]
    },
    17: { // 1-0.8 = .2       0.8-0.55 = .25     0.55-0.35 = .2     0.35-0.15 = .2     0.15-0 = .15
      lv1: [0.80, 1.00], lv2: [0.55, 0.80], lv3: [0.35, 0.55], lv4: [0.15, 0.35], lv5: [0.00, 0.15]
    },
    18: { // 1-0.85 = .15     0.85-0.6 = .25     0.6-0.4 = .2       0.4-0.2 = .2       0.2-0 = .2
      lv1: [0.85, 1.00], lv2: [0.60, 0.85], lv3: [0.40, 0.60], lv4: [0.20, 0.40], lv5: [0.00, 0.20]
    },
    19: { // 1-0.9 = .1       0.9-0.65 = .25     0.65-0.4 = .25     0.4-0.2 = .2       0.2-0 = .2
      lv1: [0.90, 1.00], lv2: [0.65, 0.90], lv3: [0.40, 0.65], lv4: [0.20, 0.40], lv5: [0.00, 0.20]
    },
    20: { // 1-0.95 = .05     0.95-0.7 = .25     0.7-0.45 = .25     0.45-0.2 = .25     0.2-0 = .2
      lv1: [0.95, 1.00], lv2: [0.70, 0.95], lv3: [0.45, 0.70], lv4: [0.20, 0.45], lv5: [0.00, 0.20]
    }
  }

  static bulletSpawnRates = [
    800,
    790,
    780,
    770,
    760,
    875,
    850,
    825,
    800,
    775,
    750,
    725,
    700,
    675,
    650,
    625,
    600,
    575,
    550,
    525
  ]

  static bulletConfigs = {
    lv1: {
      radius: 10,
      damage: 1,
      speed: 1.5
    },
    lv2: {
      radius: 15,
      damage: 2,
      speed: 2.25
    },
    lv3: {
      radius: 20,
      damage: 3,
      speed: 3
    },
    lv4: {
      radius: 25,
      damage: 4,
      speed: 3.5
    },
    lv5: {
      radius: 30,
      damage: 5,
      speed: 4
    }
  }

  static powerUpRates = {
    Kaboom: [0.00, 0.10], // 10%
    Health: [0.10, 0.40], // 30%
    Invinicbility: [0.40, 0.50], // 10%
    Experience: [0.50, 0.75], // 25%
    Speed: [0.75, 1.00] // 25%
  }

  static powerupElGen(type) {
    const el = document.createElement('div');
    el.classList.add('powerup');
    switch (type) {
      case 'Kaboom':
        el.classList.add('kaboom');
        break;
      case 'Health':
        el.classList.add('health');
        break;
      case 'Experience':
        el.classList.add('experience');
        break;
      case 'Invinicbility':
        el.classList.add('invincibility');
        break;
      case 'Speed':
        el.classList.add('speed');
        break;
      default:
        console.log("You're not supposed to be here!!!");
    }
    return el;
  }

  static getWeightedBullet(level) {
    const randomNum = Math.random().toFixed(2);
    return Object.keys(this.bulletWeights[level]).find((item) => Utils.inRange(
      randomNum,
      this.bulletWeights[level][item][0],
      this.bulletWeights[level][item][1]
    ));
  }

  static checkLevelUp(player) {
    const { level } = player.stats;
    if (player.stats.experience >= this.characterLevelUpBreakpoints[level - 1]) {
      document.dispatchEvent(this.levelUpEvt);
    }
  }

  static getWeightedPowerUp() {
    const randomNum = Math.random().toFixed(2);
    return Object.keys(this.powerUpRates).find((power) => Utils.inRange(randomNum,
      this.powerUpRates[power][0],
      this.powerUpRates[power][1]));
  }
}