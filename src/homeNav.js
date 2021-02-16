const helpButton = document.getElementById('help');
const helpPage = document.getElementById('help-page');
const helpControls = document.getElementById('help-controls');
const helpSkills = document.getElementById('help-skills');
const helpBack = document.getElementById('help-back');
const helpPowerups = document.getElementById('help-powerups');
const controlsPane = document.getElementById('controls-pane');
const skillsPane = document.getElementById('skills-pane');
const powerupsPane = document.getElementById('powerups-pane');

const aboutPage = document.getElementById('about-page');
const aboutButton = document.getElementById('about');
const aboutBack = document.getElementById('about-back');

helpButton.addEventListener('click', () => {
  document.getElementById('home').style.display = 'none';
  helpPage.style.display = 'flex';
  controlsPane.style.opacity = 1;
  playSound(buttonSelect);
});

helpBack.addEventListener('click', () => {
  document.getElementById('home').style.display = 'flex';
  helpPage.style.display = 'none';
  playSound(buttonSelect);
});

helpControls.addEventListener('click', () => {
  helpControls.classList.add('active-tab');
  helpSkills.classList.remove('active-tab');
  helpPowerups.classList.remove('active-tab');
  setTimeout(() => { controlsPane.style.opacity = '1'; }, 1);
  controlsPane.style.display = 'flex';
  skillsPane.style.display = 'none';
  skillsPane.style.opacity = '0';
  powerupsPane.style.display = 'none';
  powerupsPane.style.opacity = '0';
  playSound(buttonSound);
});

helpSkills.addEventListener('click', () => {
  helpSkills.classList.add('active-tab');
  helpControls.classList.remove('active-tab');
  helpPowerups.classList.remove('active-tab');
  skillsPane.style.display = 'flex';
  setTimeout(() => { skillsPane.style.opacity = '1'; }, 1);
  controlsPane.style.display = 'none';
  controlsPane.style.opacity = '0';
  powerupsPane.style.display = 'none';
  powerupsPane.style.opacity = '0';
  playSound(buttonSound);
});

helpPowerups.addEventListener('click', () => {
  helpPowerups.classList.add('active-tab');
  helpControls.classList.remove('active-tab');
  helpSkills.classList.remove('active-tab');
  setTimeout(() => { powerupsPane.style.opacity = '1'; }, 1);
  powerupsPane.style.display = 'flex';
  controlsPane.style.display = 'none';
  controlsPane.style.opacity = '0';
  skillsPane.style.display = 'none';
  skillsPane.style.opacity = '0';
  playSound(buttonSound);
});

aboutButton.addEventListener('click', () => {
  document.getElementById('home').style.display = 'none';
  aboutPage.style.display = 'flex';
  playSound(buttonSelect);
});

aboutBack.addEventListener('click', () => {
  document.getElementById('home').style.display = 'flex';
  aboutPage.style.display = 'none';
  playSound(buttonSelect);
});
