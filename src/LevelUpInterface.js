class LevelUpInterface {
  constructor(player) {
    this.player = player;
    player.stats.skillPoints += 1;
    player.stats.level += 1;
    this.skills = { ...player.stats };
  }

  refreshInterface(skill) {
    return new CustomEvent('refresh-interface', { detail: { skill } });
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
      this.refreshInterface(skill);
    }
  }

  removePoint(skill) {
    if (this.skills[skill] > this.player.stats[skill]) {
      this.skills[skill] -= 1;
      this.skills.skillPoints += 1;
      this.refreshInterface(skill);
    } else {
      console.log('No uncommited points remaining.');
    }
  }

  confirmSkills() {
    this.player.stats = this.skills;
    this.player.syncStats();
  }
}
