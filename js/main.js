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

function clearMsg() {
  battlegroundTextEl.innerText = '';
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

function playCard() {
  deployEl.style.display = 'none';
  pOneCard = players[1].deck.pop();
  pTwoCard = players[-1].deck.pop();
  clearMsg();
  renderPlayCards(pOneCard, pTwoCard);
  getHandResults(pOneCard, pTwoCard);
  if (getWinner() === players[1]) {
    renderGameWon(
      `All of ${players[-1].name}'s troops have fallen. ${
        players[1].name
      } has won the war!`
    );
  } else if (getWinner() === players[-1]) {
    renderGameWon(
      `All of ${players[1].name}'s troops have fallen. ${
        players[-1].name
      } has won the war!`
    );
  } else if (getWinner() === 'tie') {
    renderGameTie();
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

function isWar(playerOneCard, playerTwoCard) {
  return getCardValue(playerOneCard) === getCardValue(playerTwoCard);
}

function war() {
  battlegroundTextEl.innerText = 'WAR!';
  setTimeout(() => {
    if (players[1].deck.length > 3 && players[-1].deck.length > 3) {
      renderWar();
      dealWar();
    } else if (players[1].deck.length < players[-1].deck.length) {
      renderGameWon(
        `${players[1].name} does not have enough troops for battle. ${
          players[-1].name
        } has won the war.`
      );
    } else {
      renderGameWon(
        `${players[1].name} does not have enough troops for battle. ${
          players[-1].name
        } has won the war.`
      );
    }
  }, 2000);
}

function dealWar() {
  playerOneWarPile = players[1].deck.splice(-3);
  playerTwoWarPile = players[-1].deck.splice(-3);
  playerOneWarPile.forEach((card) => spoils.push(card));
  playerOneWarPile.splice(0);
  playerTwoWarPile.forEach((card) => spoils.push(card));
  playerTwoWarPile.splice(0);
  getHandResults(players[1].deck.pop(), players[-1].deck.pop());
  if (getWinner() === players[1]) {
    renderGameWon(players[1], players[-1]);
  } else if (getWinner() === players[-1]) {
    renderGameWon(players[-1], players[1]);
  } else if (getWinner() === 'tie') {
    renderGameTie();
  }
}

function toTheVictorGoTheSpoils(victor) {
  spoils.forEach((card) => victor.deck.splice(0, 0, card));
  spoils.splice(0);
  setTimeout(() => {
    renderSpoils(victor.deckEl);
  }, 2000);
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
      }px;"></div>`
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

function renderDeck(deckEl) {
  for (let s = 0; s < deckEl.childElementCount; s++) {
    deckEl.children[s].style.zIndex = s;
    deckEl.children[s].style.position = 'absolute';
    deckEl.children[s].style.left = s + 'px';
  }
}

function renderPlay() {
  battlegroundDeckEl.innerHTML = '';
  players[1].deckEl = deckOneEl;
  players[-1].deckEl = deckTwoEl;
  shuffleDeck(masterDeck, shuffledDeck);
  deal(shuffledDeck, players[1].deck, players[-1].deck);
  playEl.style.display = 'none';
  deployEl.style.display = 'block';
  renderDeckDown('1', deckOneEl);
  renderDeck(deckOneEl);
  renderDeckDown('-1', deckTwoEl);
  renderDeck(deckTwoEl);
}

function renderPlayCards(cOne, cTwo) {
  playerOneSoldierEl.appendChild(deckOneEl.lastChild);
  playerTwoSoldierEl.appendChild(deckTwoEl.lastChild);
  playerOneSoldierEl.innerHTML = `<div class="card ${cOne.face}" id="${playerOneSoldierEl.lastChild.id}"></div>`;
  playerTwoSoldierEl.innerHTML = `<div class="card ${cTwo.face}" id="${playerTwoSoldierEl.lastChild.id}"></div>`;
}

function renderWar() {
  for (let c = 0; c < 3; c++) {
    playerOneSoldierEl.appendChild(deckOneEl.lastChild);
    playerOneSoldierEl.children[c].style.zIndex = c;
    playerOneSoldierEl.children[c].style.left = c** + 50 + 'px';
    playerTwoSoldierEl.appendChild(deckTwoEl.lastChild);
    playerTwoSoldierEl.children[c].style.zIndex = c;
    playerTwoSoldierEl.children[c].style.left = c** + 50 + 'px';
  }
  playerOneSoldierEl.appendChild(deckOneEl.lastChild);
  playerOneSoldierEl.lastChild.style.zIndex = 4;
  playerOneSoldierEl.lastChild.style.left = '66px';
  playerOneSoldierEl.lastChild.setAttribute(
    'class',
    `card ${playerOneSoldierEl.lastChild.id}`
  );
  playerTwoSoldierEl.appendChild(deckTwoEl.lastChild);
  playerTwoSoldierEl.lastChild.style.zIndex = 4;
  playerTwoSoldierEl.lastChild.style.left = '66px';
  playerTwoSoldierEl.lastChild.setAttribute(
    'class',
    `card ${playerTwoSoldierEl.lastChild.id}`
  );
}

function renderSpoils(winningDeckEl) {
  let sCount = playerOneSoldierEl.childElementCount;
  for (let s = 0; s < sCount; s++) {
    playerOneSoldierEl.lastChild.setAttribute('class', 'card back');
    playerTwoSoldierEl.lastChild.setAttribute('class', 'card back');
    winningDeckEl.prepend(
      playerOneSoldierEl.lastChild,
      playerTwoSoldierEl.lastChild
    );
  }
  renderDeck(winningDeckEl);
  deployEl.style.display = 'block';
}

function renderGameTie() {
  deployEl.style.display = 'none';
  redeployEl.style.display = 'block';
  battlegroundTextEl.innerText = `All of troops have fallen. In war, nobody wins!`;
}

function renderGameWon(msg) {
  deployEl.style.display = 'none';
  redeployEl.style.display = 'block';
  battlegroundTextEl.innerText = msg;
}

initialize();
