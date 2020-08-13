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
let playerOneWarPile = [];
let playerTwoWarPile = [];
let spoils = [];

/*----- cached element references -----*/

const deckOneEl = document.getElementById('player-one-deck');
const deckTwoEl = document.getElementById('player-two-deck');
const battlegroundEl = document.getElementById('battleground');
const battlegroundTextEl = document.getElementById('battleground-text');
const battlegroundDeckEl = document.getElementById('battleground-deck');
const playerOneSoldierEl = document.getElementById('player-one-soldier');
const playerTwoSoldierEl = document.getElementById('player-two-soldier');
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
  renderSpoils(victor.deckEl);
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
    war();
  } else if (getCardValue(cardOne) > getCardValue(cardTwo)) {
    toTheVictorGoTheSpoils(players[1]);
  } else if (getCardValue(cardOne) < getCardValue(cardTwo)) {
    toTheVictorGoTheSpoils(players[-1]);
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
        index * 20
      }px"></div>`
    );
  }, '');
  container.innerHTML = cardsHtml;
}

function renderDeckDown(player, container) {
  let deck = players[player].deck;
  for (let i = 0; i < deck.length; i++) {
    container.innerHTML = '';
    const cardsBackHtml = deck.reduce((html, card) => {
      let index = deck.indexOf(card);
      return html + `<div class="card back" id="${card.face}"></div>`;
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
  renderDeck(deckOneEl);
  renderDeckDown('-1', deckTwoEl);
  renderDeck(deckTwoEl);
}

function isWar(playerOneCard, playerTwoCard) {
  return getCardValue(playerOneCard) === getCardValue(playerTwoCard);
}

/*
Something is wrong here, 
adds first up card and second 
down card to winner only, 
leaves 1st and 3rd down card 
and final up card on battleground
*/
function renderWar(numDownCards) {
  battlegroundTextEl.innerText = 'WAR!';
  setTimeout(() => {
    for (let c = 0; c <= numDownCards; c++) {
      playerOneSoldierEl.appendChild(deckOneEl.lastChild);
      playerTwoSoldierEl.appendChild(deckTwoEl.lastChild);
      playerOneSoldierEl.children[c].setAttribute(
        'style',
        `z-index: ${c}; left: ${c * 20 + 100}px`
      );
      playerTwoSoldierEl.children[c].setAttribute(
        'style',
        `z-index: ${c}; left: ${c * 20 + 100}px`
      );
    }
  }, 2500);
  setTimeout(() => {
    playerOneSoldierEl.appendChild(deckOneEl.lastChild);
    playerTwoSoldierEl.appendChild(deckTwoEl.lastChild);
    playerOneSoldierEl.lastChild.setAttribute(
      'style',
      `z-index: ${numDownCards + 1}; left: ${(numDownCards + 1) * 20 + 100}px`
    );
    playerOneSoldierEl.lastChild.setAttribute(
      'class',
      `card ${playerOneSoldierEl.lastChild.id}`
    );
    playerTwoSoldierEl.lastChild.setAttribute(
      'style',
      `z-index: ${numDownCards + 1}; left: ${(numDownCards + 1) * 20 + 100}px`
    );
    playerTwoSoldierEl.lastChild.setAttribute(
      'class',
      `card ${playerTwoSoldierEl.lastChild.id}`
    );
  }, 2500);
}

function dealWar(numCardsDown) {
  playerOneWarPile = players[1].deck.splice(numCardsDown);
  playerTwoWarPile = players[-1].deck.splice(numCardsDown);
  playerOneWarPile.forEach((card) => spoils.push(card));
  playerOneWarPile.splice(0);
  playerTwoWarPile.forEach((card) => spoils.push(card));
  playerTwoWarPile.splice(0);
}

function war() {
  if (players[1].deck.length > 3 && players[-1].deck.length > 3) {
    dealWar(3);
    setTimeout(playCard, 2500);
    renderWar(3);
  } else if (players[1].deck.length < 4) {
    dealWar(players[1].deck.length - 1);
    setTimeout(playCard, 2500);
    renderWar(players[1].deck.length - 1);
  } else if (players[-1].deck.length < 4) {
    dealWar(players[-1].deck.length - 1);
    setTimeout(playCard, 2500);
    renderWar(players[-1].deck.length - 1);
  }
}

function renderPlayCard() {
  playerOneSoldierEl.appendChild(deckOneEl.lastChild);
  playerTwoSoldierEl.appendChild(deckTwoEl.lastChild);
  playerOneSoldierEl.innerHTML = `<div class="card ${playerOneSoldierEl.lastChild.id}" id="${playerOneSoldierEl.lastChild.id}"></div>`;
  playerTwoSoldierEl.innerHTML = `<div class="card ${playerTwoSoldierEl.lastChild.id}" id="${playerTwoSoldierEl.lastChild.id}"></div>`;
}

function renderDeck(deckEl) {
  for (let s = 0; s < deckEl.childElementCount; s++) {
    deckEl.children[s].setAttribute(
      'style',
      `z-index: ${s}; position: absolute; left: ${s}px`
    );
  }
}

function renderSpoils(winningDeckEl) {
  setTimeout(() => {
    for (let s = 0; s < playerOneSoldierEl.childElementCount; s++) {
      playerOneSoldierEl.children[s].setAttribute('class', 'card back');
      winningDeckEl.insertBefore(
        playerOneSoldierEl.children[s],
        winningDeckEl.firstChild
      );
      playerTwoSoldierEl.children[s].setAttribute('class', 'card back');
      winningDeckEl.insertBefore(
        playerTwoSoldierEl.children[s],
        winningDeckEl.firstChild
      );
    }
    renderDeck(winningDeckEl);
  }, 1000);
}

function playCard() {
  pOneCard = players[1].deck.pop();
  pTwoCard = players[-1].deck.pop();
  renderPlayCard();
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
