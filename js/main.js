/*------------- constants -------------*/

const suits = ['s', 'c', 'd', 'h'];
const ranks = [
  'A',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  'J',
  'Q',
  'K',
];
const masterDeck = buildMasterDeck();

const players = {
  '1': {
    name: 'Player One',
    deck: [],
    deckEl: null,
  },
  '-1': {
    name: 'Player Two',
    deck: [],
    deckEl: null,
  },
};

/*------ app's state (variables) ------*/

let pOneCard;
let pTwoCard;
let shuffledDeck = [];
let deckOne = [];
let deckTwo = [];
let spoils = [];

/*----- cached element references -----*/

const deckOneEl = document.getElementById('player-one-deck');
const deckTwoEl = document.getElementById('player-two-deck');
const battlegroundDeckEl = document.getElementById('battleground-deck');
const battlegroundTextEl = document.getElementById('battleground-text');
const spoilsEl = document.getElementById('spoils');
const deployEl = document.getElementById('deploy');
const redeployEl = document.getElementById('redeploy');
const playEl = document.getElementById('play');
const playerOneNameEl = document.getElementById('player-one-name');
const playerTwoNameEl = document.getElementById('player-two-name');
const playerOneNameSubmitEl = document.getElementById('player-one-name-submit');
const playerTwoNameSubmitEl = document.getElementById('player-two-name-submit');

/*---------- event listeners ----------*/

playEl.addEventListener('click', renderPlay);
deployEl.addEventListener('click', playCard);
redeployEl.addEventListener('click', initialize);
playerOneNameSubmitEl.addEventListener('click', () => {
  if (playerOneNameEl.value !== '') {
    players[1].name = playerOneNameEl.value;
  }
});
playerTwoNameSubmitEl.addEventListener('click', () => {
  if (playerTwoNameEl.value !== '') {
    players[-1].name = playerTwoNameEl.value;
  }
});

/*------------- functions -------------*/

function initialize() {
  deployEl.style.display = 'none';
  redeployEl.style.display = 'none';
  renderDeckInContainer(masterDeck, battlegroundDeckEl);
}

function buildMasterDeck() {
  const deck = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({
        face: `${suit}${rank}`,
        back: 'back',
      });
    });
  });
  return deck;
}

function shuffleDeck(deck, newDeck) {
  const tempDeck = [...deck];
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
  }
  switch (card) {
    case 'J':
      cardValue = 11;
      break;
    case 'Q':
      cardValue = 12;
      break;
    case 'K':
      cardValue = 13;
      break;
    case 'A':
      cardValue = 14;
      break;
    default:
      cardValue = parseInt(card);
  }
  return cardValue;
}

function deal(dShuffled, dOne, dTwo) {
  for (let i = 0; i < dShuffled.length; i++) {
    if (i % 2 === 1) {
      dOne.push(dShuffled[i]);
    } else {
      dTwo.push(dShuffled[i]);
    }
  }
}

function toTheVictorGoTheSpoils(victor) {
  spoils.forEach((card) => victor.deck.splice(0, 0, card));
  spoils.splice(0);
}

function getWinner() {
  if (players[1].deck.length === 0 && players[-1].deck.length === 0) {
    return 'tie';
  } else if (players[1].deck.length === 52) {
    return players[1];
  } else if (players[-1].deck.length === 52) {
    return players[-1];
  }
}

function getHandResults(cardOne, cardTwo) {
  spoils.push(cardOne, cardTwo);
  if (isWar(cardOne, cardTwo)) {
    renderWar();
  }
  if (getCardValue(cardOne) > getCardValue(cardTwo)) {
    toTheVictorGoTheSpoils(players[1]);
    console.log(players[1].deck, players[-1].deck);
  } else if (getCardValue(cardOne) < getCardValue(cardTwo)) {
    toTheVictorGoTheSpoils(players[-1]);
    console.log(players[1].deck, players[-1].deck);
  }
}

function renderGameWon(winner, loser) {
  deployEl.style.display = 'none';
  redeployEl.style.display = 'block';
  battlegroundTextEl.innerText = `All of ${loser.name}'s troops have fallen. ${winner.name} has won the war!`;
}

function renderGameTie() {
  deployEl.style.display = 'none';
  redeployEl.style.display = 'block';
  battlegroundTextEl.innerText = `All of troops have fallen. In war, nobody wins!`;
}

function renderDeckInContainer(deck, container) {
  container.innerHTML = '';
  const cardsHtml = deck.reduce((html, card) => {
    let index = deck.indexOf(card);
    return (
      html +
      `<div class="card ${
        card.face
      }" style="z-index: ${index}; position: absolute; left: ${
        index * 20 + 'px'
      }"></div>`
    );
  }, '');
  container.innerHTML = cardsHtml;
}

function renderDeckDown(player, container) {
  let deck = players[player].deck;
  let pName = players[player].name + ' ';
  for (let i = 0; i < deck.length; i++) {
    container.innerHTML = '';
    const cardsBackHtml = deck.reduce((html, card) => {
      let index = deck.indexOf(card);
      return (
        html +
        `<div class="card ${card.back}" id="${
          pName + ' ' + index
        }" style="z-index: ${index}; position: absolute; left: ${
          index + 'px'
        }"></div>`
      );
    }, '');
    container.innerHTML = cardsBackHtml;
  }
}

function renderPlay() {
  battlegroundDeckEl.innerHTML = '';
  players[1].deck = deckOne;
  players[1].deckEl = deckOneEl;
  players[-1].deck = deckTwo;
  players[-1].deckEl = deckTwoEl;
  shuffleDeck(masterDeck, shuffledDeck);
  deal(shuffledDeck, deckOne, deckTwo);
  playEl.style.display = 'none';
  deployEl.style.display = 'block';
  renderDeckDown('1', deckOneEl);
  renderDeckDown('-1', deckTwoEl);
}

function isWar(playerOneCard, playerTwoCard) {
  return getCardValue(playerOneCard) === getCardValue(playerTwoCard);
}

function renderWar() {
  let playerOneWarPile = [];
  let playerTwoWarPile = [];
  let playerOneFaceUp = null;
  let playerTwoFaceUp = null;
  if (players[1].deck.length > 3 && players[-1].deck.length > 3) {
    playerOneWarPile = players[1].deck.splice(-3);
    playerTwoWarPile = players[-1].deck.splice(-3);
    playerOneFaceUp = players[1].deck.pop();
    playerTwoFaceUp = players[-1].deck.pop();
    playerOneWarPile.forEach((card) => spoils.push(card));
    playerOneWarPile.splice(0);
    playerTwoWarPile.forEach((card) => spoils.push(card));
    playerTwoWarPile.splice(0);
    if (isWar(playerOneFaceUp, playerTwoFaceUp)) {
      renderWar();
    } else getHandResults(playerOneFaceUp, playerTwoFaceUp);
  } else if (players[1].deck.length < 3) {
    playerOneWarPile = players[1].deck.splice(
      (players[1].deck.length - 1) * -1
    );
    playerTwoWarPile = players[-1].deck.splice(
      (players[1].deck.length - 1) * -1
    );
    playerOneFaceUp = players[1].deck.pop();
    playerTwoFaceUp = players[-1].deck.pop();
    playerOneWarPile.forEach((card) => spoils.push(card));
    playerOneWarPile.splice(0);
    playerTwoWarPile.forEach((card) => spoils.push(card));
    playerTwoWarPile.splice(0);
  } else {
    playerOneWarPile = players[1].deck.splice(
      (players[-1].deck.length - 1) * -1
    );
    playerTwoWarPile = players[-1].deck.splice(
      (players[-1].deck.length - 1) * -1
    );
    playerOneFaceUp = players[1].deck.pop();
    playerTwoFaceUp = players[-1].deck.pop();
    playerOneWarPile.forEach((card) => spoils.push(card));
    playerOneWarPile.splice(0);
    playerTwoWarPile.forEach((card) => spoils.push(card));
    playerTwoWarPile.splice(0);
  }
}

function playCard() {
  pOneCard = players[1].deck.pop();
  pTwoCard = players[-1].deck.pop();
  getHandResults(pOneCard, pTwoCard);
  if (getWinner() === players[1]) {
    renderGameWon(players[1], players[-1]);
  } else if (getWinner() === players[-1]) {
    renderGameWon(players[-1], players[1]);
  } else if (getWinner() === 'tie') {
    renderGameTie();
  }
}

initialize();
