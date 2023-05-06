/*----- constants -----*/
const eventImgs = {
  Treasure: '<img src="imgs/treasure.png" alt="Treasure">',
  Mummy: '<img src="imgs/mummy.png" alt="Mummy">',
  Snake: '<img src="imgs/snake.png" alt="Snake">',
  Spider: '<img src="imgs/spider.png" alt="Spider">',
  Rockfall: '<img src="imgs/rockfall.png" alt="Rockfall">',
  Fire: '<img src="imgs/fire.png" alt="Fire">'
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

let roundEnded //redundant with temple collapse, can just check update directly if templeCollapse is true
let gameEnded

let deck // The deck that will be used for the round
let playedCards // Cards that have already been played from the deck
let currentEvent

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
const startGame = document.querySelector('#startGame')
const startRound = document.querySelector('#startRound')
const homePage = document.querySelector('#homePage')

/*----- functions -----*/
const renderEvent = () => {}

const renderScore = () => {
  playerTotalEl.innerText = player.totalScore
  playerRoundEl.innerText = player.roundScore
  computerTotalEl.innerText = computer.totalScore
  computerRoundEl.innerText = computer.roundScore
}

const renderControls = () => {
  playerChoices.style.visibility = !playerRan ? 'initial' : 'hidden'
  startGame.style.visibility = gameEnded ? 'initial' : 'hidden' //won't reappear
  startRound.style.visibility = roundEnded ? 'initial' : 'hidden' //won't reappear
  homePage.style.visibility = gameEnded ? 'initial' : 'hidden' //won't reappear
}

const render = () => {
  renderScore()
  renderControls()
}

const init = () => {
  round = 1
  winner = null
  gameEnded = false
  playerRan = false
  computerRan = false
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

//Shuffle alorithm: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const deckInit = () => {
  let roundDeck = [...cards]

  for (let i = roundDeck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[roundDeck[i], roundDeck[j]] = [roundDeck[j], roundDeck[i]]
  }
  return roundDeck
}

const initRound = () => {
  round += 1
  player.roundScore = 0
  computer.roundScore = 0
  remainingTreasure = 0
  playerRan = false
  computerRan = false
  roundEnded = false

  deck = deckInit()
  playedCards = []
  currentEvent = null
  priorEventsEl.innerHTML = 'Prior events:'
  runEvent()
  render()
}

const eventType = (event) => {
  if (event.includes('Treasure')) {
    return 'Treasure'
  } else {
    return event.split(' ')[1]
  }
}

const newEvent = () => {
  if (currentEvent) {
    priorEventsEl.innerHTML += eventImgs[eventType(currentEvent)]
  }
  currentEvent = deck.pop()
  playedCards.push(currentEvent)
  currentEventEl.innerHTML = eventImgs[eventType(currentEvent)]
}

const divideTreasure = () => {
  let value = +currentEvent.split(' ')[1]
  if (!playerRan && !computerRan) {
    player.roundScore += Math.floor(value / 2)
    computer.roundScore += Math.floor(value / 2)
    remainingTreasure += value % 2
  } else if (!playerRan) {
    player.roundScore += value
  } else {
    computer.roundScore += value
  }
}

const checkForCollapse = () => {
  if (playedCards.slice(0, playedCards.length - 1).includes(currentEvent)) {
    roundEnded = true
    player.roundScore = 0
    computer.roundScore = 0
  }
}

const runEvent = () => {
  newEvent()
  if (currentEvent.includes('Treasure')) {
    divideTreasure()
  } else {
    checkForCollapse()
  }
}

//Rename this function
const scoreRound = (pMove, cMove) => {
  if (pMove === 'run' && cMove === 'run') {
    remainingTreasure = 0
  }
  if (pMove === 'run') {
    player.totalScore += player.roundScore + remainingTreasure
    player.roundScore = 0
    remainingTreasure = 0
    playerRan = true
  }
  if (cMove === 'run') {
    computer.totalScore += computer.roundScore
    computer.roundScore = 0
    remainingTreasure = 0
    computerRan = true
  }
}

const checkWinner = () => {
  if (player.totalScore === computer.totalScore) {
    winner = 'tie'
  } else {
    winner = player.totalScore > computer.totalScore ? 'player' : 'computer'
  }
}

//This may be counting wrong
const gameStatus = () => {
  if (!roundEnded) {
    roundEnded = playerRan && computerRan ? true : false
  }
  gameEnded = roundEnded && round > 5 ? true : false
}

const collapseProbability = () => {
  let hazards = 0
  playedCards.forEach((card) => {
    if (card.includes('Hazard')) hazards += 1
  })
  return (hazards * 2) / deck.length
}

const computerDescision = () => {}

const handleDescision = (e) => {
  if (e.target.tagName !== 'DIV') return

  let playerMove = e.target.className
  let computerMove = computerRan ? null : computerDescision()

  scoreRound(playerMove, computerMove)
  runEvent()
  gameStatus()
  render()
}

/*----- event listeners -----*/

playerChoices.addEventListener('click', handleDescision)

startRound.addEventListener('click', initRound)
startGame.addEventListener('click', init)
homePage.addEventListener('click', () => {
  location.href = '/index.html'
})

init()
