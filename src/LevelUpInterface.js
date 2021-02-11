class LevelUpInterface {
  constructor(player) {
    this.player = player;
    player.stats.level += 1;
    if (player.stats.level !== 1) {
      if (player.stats.level % 5) {
        player.stats.skillPoints += 1;
      } else {
        player.stats.skillPoints += 2;
      }
    }
    this.skills = { ...player.stats };
  }

  validateSkill(skill) {
    const currentSkillLevel = this.skills[skill];
    if (this.skills.skillPoints < 1) return false;
    if (this.skills.level >= LevelData.skillPointGates[skill][currentSkillLevel + 1]) return true;
    return LevelData.skillPointGates[skill][currentSkillLevel + 1];
  }

  addPoint(skill) {
    const currentSkillLevel = this.skills[skill];
    if (this.skills[skill] < 5 && this.validateSkill(skill)) {
      this.skills[skill] += 1;
      this.skills.skillPoints -= 1;
    }
  }

  checkRemovable(skill) {
    return (this.skills[skill] > this.player.stats[skill]);
  }

  removePoint(skill) {
    if (this.checkRemovable(skill)) {
      this.skills[skill] -= 1;
      this.skills.skillPoints += 1;
    } else {
      console.log('No uncommited points remaining.');
    }
  }

  confirmSkills() {
    this.player.stats.maxHealth = this.skills.maxHealth;
    this.player.stats.armor = this.skills.armor;
    this.player.stats.speed = this.skills.speed;
    this.player.stats.luck = this.skills.luck;
    this.player.stats.adrenaline = this.skills.adrenaline;
    this.player.stats.size = this.skills.size;
    this.player.stats.skillPoints = this.skills.skillPoints;
    this.player.syncStats();
    this.skills = { ...this.player.stats };
  }
}
