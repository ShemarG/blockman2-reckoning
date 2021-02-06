const game = new Game(document.getElementById('el'));

const homeScreen = document.getElementById('homescreen');

const startButton = document.getElementById('start');
startButton.innerText = 'Begin';
startButton.style.fontSize = '4em';
startButton.style.marginTop = '5em';
startButton.style.marginLeft = '4.05em';
startButton.style.fontFamily = 'Impact';

setInterval(() => {
  startButton.style.display = 'none';
}, 600);
setInterval(() => {
  startButton.style.display = 'block';
}, 1000);

const aboutButton = document.getElementById('about');
aboutButton.innerText = 'About';
aboutButton.style.fontFamily = 'Impact';
aboutButton.style.fontSize = '2em';
aboutButton.style.marginTop = '13em';
aboutButton.style.marginLeft = '9.5em';

const aboutUs = document.getElementById('aboutUs');
aboutUs.innerText = 'testttttttttttttttttt';
aboutUs.style.fontFamily = '';

// const backButton = document.getElementById("backButton")
// //backButton.innerText = "Back"
// backButton.style.fontFamily = "Impact"
// backButton.style.

startButton.addEventListener('click', () => {
  game.togglePause();
  startButton.style.display = 'none';
  homeScreen.style.display = 'none';
  aboutButton.style.display = 'none';
  aboutPage.style.display = 'none';
  aboutUs.style.display = 'none';
});

aboutButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  homeScreen.style.display = 'none';
  aboutButton.style.display = 'none';
});
