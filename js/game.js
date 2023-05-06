/*----- constants -----*/
const eventImgs = {
  treasure: '',
  mummy: '',
  snakes: '',
  spiders: '',
  rockfall: '',
  fire: ''
}
const cards = [
  'Treasure: 1',
  'Treasure: 2',
  'Treasure: 3',
  'Treasure: 4',
  'Treasure: 5',
  'Treasure: 6',
  'Treasure: 7',
  'Treasure: 8',
  'Treasure: 9',
  'Treasure: 10',
  'Treasure: 11',
  'Treasure: 12',
  'Treasure: 13',
  'Treasure: 14',
  'Treasure: 15',
  'Hazard: Mummy',
  'Hazard: Snake',
  'Hazard: Spider',
  'Hazard: Rockfall',
  'Hazard: Fire',
  'Hazard: Mummy',
  'Hazard: Snake',
  'Hazard: Spider',
  'Hazard: Rockfall',
  'Hazard: Fire',
  'Hazard: Mummy',
  'Hazard: Snake',
  'Hazard: Spider',
  'Hazard: Rockfall',
  'Hazard: Fire'
] //update to create using a card class

/*----- state variables -----*/
let round // Round number
let winner // Game winner
let player // Object with the players total & round scores
let computer // Object with the computer total & round scores
let remainingTreasure // Any remainder that wasn't able to be split between the players

let playerRan // Has the player left the temple
let computerRan // Has the computer left the temple
let templeCollapse // Has the temple collapsed
let roundEnded
let gameEnded

let deck // The deck that will be used for the round
let playedCards // Cards that have already been played from the deck

/*----- cached elements  -----*/

const playerChoices = document.querySelector('#playerChoices')
const messageEl = document.querySelector('#statusMessage') //who is continuing
const eventMessageEl = document.querySelector('#eventDescription') //description of current event
const currentEventEl = document.querySelector('#currentEvent')
const priorEventsEl = document.querySelector('#previousEvents')
const playerTotalEl = document.querySelector('#playerTotal')
const playerRoundEl = document.querySelector('#playerRound')
const computerTotalEl = document.querySelector('#computerTotal')
const computerRoundEl = document.querySelector('#computerRound')
const startGameEls = document.querySelector('#gameEnded')

/*----- functions -----*/
const renderEvent = () => {}

const renderScore = () => {
  playerTotalEl.innerText = player.totalScore
  playerRoundEl.innerText = player.roundScore
  computerTotalEl.innerText = computer.totalScore
  computerRoundEl.innerText = computer.roundScore
}

const renderControls = () => {
  playerChoices.style.visibility = !playerRan ? 'visibile' : 'invisible'
  document.querySelector('#startRound').style.visibility = roundEnded
    ? 'visibile'
    : 'invisible'
  startGameEls.style.visibility = gameEnded ? 'visibile' : 'invisible'
}

const render = () => {
  renderScore()
  renderEvent()
  renderControls()
}

const init = () => {
  round = 1
  winner = null
  gameEnded = false
  playerRan = false
  computerRan = false
  templeCollapse = false
  roundEnded = true
  player = {
    totalScore: 0,
    roundScore: 0
  }
  computer = {
    totalScore: 0,
    roundScore: 0
  }
  render()
}

//Shuffle alorithm
const deckInit = (cards) => {
  let roundDeck = [] //get the card values into this arr

  for (let i = roundDeck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[roundDeck[i], roundDeck[j]] = [roundDeck[j], roundDeck[i]]
  }
  console.log(roundDeck)
}

const initRound = () => {
  round += 1
  player.roundScore = 0
  computer.roundScore = 0
  remainingTreasure = 0
  playerRan = false
  computerRan = false
  templeCollapse = false
  roundEnded = false

  deck = deckInit()
  playedCards = []
  render()
}

/*----- event listeners -----*/
init()
