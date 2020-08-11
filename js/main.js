/*------------- constants -------------*/

const suits = ["s", "c", "d", "h"];
const ranks = [
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
const masterDeck = buildMasterDeck();

/*------ app's state (variables) ------*/

let shuffledDeck = [];
let deckOne = [];
let deckTwo = [];
let spoils = [];

/*----- cached element references -----*/

const playerOneDeck = document.getElementById("player-one-deck");
const playerTwoDeck = document.getElementById("player-two-deck");
const battlefieldDeck = document.getElementById("battleground-deck");
const spoilsDeck = document.getElementById("spoils");
const deploy = document.getElementById("deploy");
const redeploy = document.getElementById("redeploy");

/*---------- event listeners ----------*/

document.getElementById("play").addEventListener("click", play);
deploy.addEventListener("click", playCard);
redeploy.addEventListener("click", playCard);

/*------------- functions -------------*/

function initialize(e) {}

function render() {}

function buildMasterDeck() {
  const deck = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({
        face: `${suit}${rank}`,
      });
    });
  });
  return deck;
}

function shuffleDeck(deck, newDeck) {
  const tempDeck = [...deck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    newDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
}

function getCardValue(c) {
  let cardFace = c.face;
  let cardValue;
  let card = '';
  for (let j = 1; j < cardFace.length; j++) {
    card += cardFace.charAt(j);
  };
  switch (card) {
    case "J":
      cardValue = 11;
      break;
    case "Q":
      cardValue = 12;
      break;
    case "K":
      cardValue = 13;
      break;
    case "A":
      cardValue = 14;
      break;
    default:
      cardValue = parseInt(card);
  };
  return cardValue;
}

function dealDecks() {}

function play() {}

function playCard() {}

render();

initialize();
