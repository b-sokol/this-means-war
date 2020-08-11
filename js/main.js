/*------------- constants -------------*/

const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const masterDeck = buildMasterDeck();

/*------ app's state (variables) ------*/

let suffledDeck;
let deckOne;
let deckTwo;
let spoils;

/*----- cached element references -----*/

const playerOneDeck = document.getElementById('player-one-deck');
const playerTwoDeck = document.getElementById('player-two-deck');
const battlefieldDeck = document.getElementById('battleground-deck');
const spoilsDeck = document.getElementById('spoils');
const deploy = document.getElementById('deploy');
const redeploy = document.getElementById('redeploy');

/*---------- event listeners ----------*/

document.getElementById('play').addEventListener('click', play);
deploy.addEventListener('click', playCard);
redeploy.addEventListener('click', playCard);

/*------------- functions -------------*/

function initialize(e) {

};

function render() {

};

function play() {

};

function playCard() {

};

render();

initialize();