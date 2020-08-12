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
    isWinner: false,
  },
  '-1': {
    name: 'Player Two',
    deck: [],
    deckEl: null,
    isWinner: false,
  },
};

/*------ app's state (variables) ------*/

let shuffledDeck = [];
let deckOne = [];
let deckTwo = [];
let spoils = [];

/*----- cached element references -----*/

const deckOneEl = document.getElementById('player-one-deck');
const deckTwoEl = document.getElementById('player-two-deck');
const battlefieldDeckEl = document.getElementById('battleground-deck');
const spoilsEl = document.getElementById('spoils');
const deployEl = document.getElementById('deploy');
const redeployEl = document.getElementById('redeploy');
const playEl = document.getElementById('play');
const playerOneNameEl = document.getElementById('player-one-name');
const playerTwoNameEl = document.getElementById('player-two-name');
const playerOneNameSubmitEl = document.getElementById('player-one-name-submit');
const playerTwoNameSubmitEl = document.getElementById('player-two-name-submit');

/*---------- event listeners ----------*/

playEl.addEventListener('click', play);
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
  renderDeckInContainer(masterDeck, battlefieldDeckEl);

}

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
  //   const newShuffledDeck = [];
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

function renderDeckInContainer(deck, container) {
  container.innerHTML = '';
  const cardsHtml = deck.reduce((html, card) => {
    let index = deck.indexOf(card);
    return html + `<div class="card ${card.face}" style="z-index: ${index}; position: absolute; left: ${
      index * 15 + 'px'
    }"></div>`;
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
        `<div class="card back" id="${
          pName + ' ' + index
        }" style="z-index: ${index}; position: absolute; left: ${
          index - 10 + 'px'
        }"></div>`
      );
    }, '');
    container.innerHTML = cardsBackHtml;
  }
}

function play() {
  battlefieldDeckEl.innerHTML = '';
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

function playCard(e) {}

render();

initialize();
