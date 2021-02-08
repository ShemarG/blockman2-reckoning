const game = new Game(document.getElementById('el'));

const homeScreen = document.getElementById('homescreen');

const startButton = document.getElementById('start');
startButton.innerText = 'Press Start';
startButton.style.fontSize = '4em';
startButton.style.color = 'white';
startButton.style.marginTop = '5em';
startButton.style.marginLeft = '2.1em';
startButton.style.fontFamily = 'Goldman';
startButton.style.fontWeight = '900'

const aboutButton = document.getElementById('about');
aboutButton.innerText = 'About';
aboutButton.style.fontFamily = 'Goldman';
aboutButton.style.fontSize = '2em';
aboutButton.style.marginTop = '20em';
aboutButton.style.marginLeft = '1em';

const aboutUs = document.getElementById('aboutUs');
aboutUs.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
aboutUs.style.fontFamily = 'Goldman';
aboutUs.style.fontSize = '1.5em';
aboutUs.style.color = 'white'
aboutUs.style.marginTop = '8em';
aboutUs.style.marginLeft = '2em';

const backButton = document.getElementById('backbutton')
backButton.innerText = 'Back';
backButton.style.fontFamily = 'Goldman';
backButton.style.marginTop = '20em';
backButton.style.marginLeft = '1em';
backButton.style.fontSize = '2em'

const restartButton = document.getElementById('restartButton')
restartButton.innerText = 'test'
restartButton.style.display = 'none'
restartButton.style.color = 'white'

startButton.addEventListener('click', () => {
  game.togglePause();
  startButton.style.display = 'none';
  homeScreen.style.display = 'none';
  aboutButton.style.display = 'none';
  aboutPage.style.display = 'none';
  aboutUs.style.display = 'none';
  backButton.style.display = 'none';
});

aboutButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  homeScreen.style.display = 'none';
  aboutButton.style.display = 'none';
  backButton.style.display = 'block'
  aboutUs.style.display = 'block'
});

backButton.addEventListener('click', () => {
    backButton.style.display = 'none'
    aboutUs.style.display = 'none'
    startButton.style.display = 'block'
    aboutButton.style.display = 'block'
})