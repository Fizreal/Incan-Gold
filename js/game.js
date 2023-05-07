/*----- constants -----*/
const eventObjects = {
  Treasure: { img: '<img src="imgs/treasure.png" alt="Treasure">' },
  Mummy: {
    img: '<img src="imgs/mummy.png" alt="Mummy">',
    desc: '...there is a dragging sound and a loud groan as a mummy limps out of the darkness!'
  },
  Snake: {
    img: '<img src="imgs/snake.png" alt="Snake">',
    desc: '...there is a rattling and a hiss before a snake lunges out from behind a rock!'
  },
  Spider: {
    img: '<img src="imgs/spider.png" alt="Spider">',
    desc: '...the room is filled with cobwebs when suddenly hundreds of spiders begin descending from the ceiling!'
  },
  Rockfall: {
    img: '<img src="imgs/rockfall.png" alt="Rockfall">',
    desc: '...a lone rock falls to the floor, before suddenly huge rocks begin crashing all around!'
  },
  Fire: {
    img: '<img src="imgs/fire.png" alt="Fire">',
    desc: '...the flame from your tortch ignates a methane deposit, causing fire to shoot up from the ground!'
  }
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
] //update to create using a card class?

const winnerMessages = {
  tie: 'Tie game, well played!',
  player: "Congratulations, you've won!",
  computer: 'Dr. Jones won, nice try.'
}

/*----- state variables -----*/
let round
let winner
let player
let computer
let remainingTreasure

let playerRan
let computerRan

let roundEnded
let gameEnded

let deck
let playedCards
let currentEvent

/*----- cached elements  -----*/

const playerChoices = document.querySelector('#playerChoices')
const gameState = document.querySelector('#gameState')
const messageEl = document.querySelector('#statusMessage')
const eventMessageEl = document.querySelector('#eventDescription')
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
const renderMessage = () => {}

const renderScore = () => {
  playerTotalEl.innerText = player.totalScore
  playerRoundEl.innerText = player.roundScore
  computerTotalEl.innerText = computer.totalScore
  computerRoundEl.innerText = computer.roundScore
}

const renderControls = () => {
  playerChoices.style.visibility =
    playerRan || roundEnded ? 'hidden' : 'initial'
  startGame.style.visibility = gameEnded ? 'initial' : 'hidden'
  startRound.style.visibility = roundEnded && !gameEnded ? 'initial' : 'hidden'
  homePage.style.visibility = gameEnded ? 'initial' : 'hidden'
}

const render = () => {
  renderScore()
  renderControls()
}

const init = () => {
  round = 0
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
  //zero out prior rounds events & messages

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

//how is the runEvent function running here?
const initRound = async () => {
  startRound.style.visibility = 'hidden'
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
  gameState.innerText = `Round ${round}/5`
  priorEventsEl.innerHTML = 'Prior events:'
  messageEl.innerText = 'You both enter the ancient temple...'
  await runEvent()
  render()
}

//There has got to be a better way to do this
//Plus rename
const updateMessage = (playerMove, computerMove, delay = 1000) => {
  if (currentEvent) {
    priorEventsEl.innerHTML += eventObjects[eventType(currentEvent)].img
    currentEventEl.innerHTML = ''
  }
  eventMessageEl.innerText = ''

  if (playerMove && computerMove && !playerRan && !computerRan) {
    messageEl.innerText = 'You both descend further into the temple...'
  } else if (playerMove && computerMove && playerRan && computerRan) {
    messageEl.innerText = 'You both return to the surface...'
  } else if (playerMove && computerMove && !playerRan && computerRan) {
    messageEl.innerText =
      'You continue further while Dr. Jones returns to the surface...'
  } else if (playerMove && computerMove && playerRan && !computerRan) {
    messageEl.innerText =
      'You return to the surface while Dr. Jones continues alone...'
  } else if (playerMove && !playerRan) {
    messageEl.innerText = 'You continue further into the temple...'
  } else if (playerMove && playerRan) {
    messageEl.innerText = 'You return to the surface...'
  } else if (computerMove && !computerRan) {
    messageEl.innerText = 'Dr. Jones continue further into the temple...'
  } else if (computerMove && computerRan) {
    messageEl.innerText = 'Dr. Jones return to the surface...'
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

const eventType = (event) => {
  if (event.includes('Treasure')) {
    return 'Treasure'
  } else {
    return event.split(' ')[1]
  }
}

//This needs to be the delayed function
const newEvent = () => {
  currentEvent = deck.pop()
  playedCards.push(currentEvent)
  let newEvent = eventType(currentEvent)
  currentEventEl.innerHTML = eventObjects[newEvent].img
  if (newEvent === 'Treasure') {
    let value = currentEvent.split(' ')[1]
    eventMessageEl.innerText = `...and find ${value} treasure${
      value > 1 ? "'s" : ''
    }`
  } else {
    eventMessageEl.innerText = eventObjects[newEvent].desc
  }
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

    //collapse message
    //move to a new element so the items don't move around in the gameArea
    eventMessageEl.innerHTML += '<br><br><b>The temple begins to collapse<b>'
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
  gameState.innerText = winnerMessages[winner]
}

const gameStatus = () => {
  if (!roundEnded) {
    roundEnded = playerRan && computerRan ? true : false
  }
  gameEnded = roundEnded && round === 5 ? true : false
  if (gameEnded) checkWinner()
}

const collapseProbability = () => {
  let hazards = 0
  playedCards.forEach((card) => {
    if (card.includes('Hazard')) hazards += 1
  })
  return (hazards * 2) / deck.length
}

//Overhaul functions estimating if the player will run, and the expected value of continuing
const playerRunExpectation = () => {
  if (playerRan) return 1
  return 0.5
}

const computerDescisionSync = (delay = 0) => {
  let outcomesContinue = []

  cards.forEach((card) => {
    if (card.includes('Treasure')) {
      let value = +card.split(' ')[1]
      let expectedValue =
        value * playerRunExpectation() +
        Math.floor(value / 2) * (1 - playerRunExpectation())
      outcomesContinue.push(expectedValue)
    } else if (playedCards.includes(card)) {
      outcomesContinue.push(-computer.roundScore)
    }
  })
  let continueEV = outcomesContinue.reduce((acc, outcome) => acc + outcome, 0)
  let descision = continueEV >= 0 ? 'continue' : 'run'
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(descision)
    }, delay)
  })
}

const computerDescisionAsync = async () => {
  while (!computerRan && !roundEnded) {
    let computerMove = await computerDescisionSync(1500)
    scoreRound(null, computerMove)
    await updateMessage(null, computerMove, 1500)
    if (!computerRan) runEvent()
    gameStatus()
    render()
  }
}

const handleDescision = async (e) => {
  if (e.target.tagName !== 'DIV') return

  playerChoices.style.visibility = 'hidden'

  let playerMove = e.target.className
  let computerMove = computerRan ? null : await computerDescisionSync()

  scoreRound(playerMove, computerMove)
  await updateMessage(playerMove, computerMove)

  if (!playerRan || !computerRan) runEvent()
  gameStatus()
  render()
  if (playerRan && !computerRan && !roundEnded) {
    computerDescisionAsync()
  }
}

/*----- event listeners -----*/

playerChoices.addEventListener('click', handleDescision)

startRound.addEventListener('click', initRound)
startGame.addEventListener('click', init)
homePage.addEventListener('click', () => {
  location.href = '/index.html'
})

init()
