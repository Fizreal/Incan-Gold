/*----- constants -----*/
const eventObjects = {
  Treasure: { img: '<img src="imgs/treasure.png" alt="Treasure">' },
  Artifact: { img: '<img src="imgs/artifact.png" alt="Artifact">' },
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
] //update to create using objects

const winnerMessages = {
  tie: 'No winner, well played.',
  You: "Congratulations, you've won!",
  Jones: 'Dr. Jones won, nice try.',
  "O'Connel": "O'Connel won, nice try."
}

/*----- state variables -----*/
let round
let winner
let player
let jones
let oConnel
let remainingTreasure

let characters

let templeCollapse
let roundEnded
let gameEnded

let deck
let artifacts
let playedCards
let currentEvent

/*----- cached elements  -----*/
//reorder these so they aren't just random
const playerChoices = document.querySelector('#playerChoices')
const gameState = document.querySelector('#gameState')
const messageEl = document.querySelector('#statusMessage')
const eventMessageEl = document.querySelector('#eventDescription')
const currentEventEl = document.querySelector('#currentEvent')
const priorEventsEl = document.querySelector('#previousEvents')
const playerTotalEl = document.querySelector('#playerTotal')
const playerRoundEl = document.querySelector('#playerRound')
const jonesTotalEl = document.querySelector('#jonesTotal')
const jonesRoundEl = document.querySelector('#jonesRound')
const oConnelTotalEl = document.querySelector('#oConnelTotal')
const oConnelRoundEl = document.querySelector('#oConnelRound')
const startGame = document.querySelector('#startGame')
const startRound = document.querySelector('#startRound')
const homePage = document.querySelector('#homePage')
const remainingTreasureDisplay = document.querySelector('#remainingTreasure')
const collapseProbabilityDisplay = document.querySelector(
  '#collapseProbability'
)

/*----- functions -----*/
const renderElements = () => {
  document.querySelector('#gameArea').className = roundEnded
    ? 'outsideTemple'
    : 'insideTemple'
  priorEventsEl.style.visibility =
    !roundEnded && playedCards.length > 1 ? 'initial' : 'hidden'
  currentEventEl.style.visibility = roundEnded ? 'hidden' : 'initial'
  eventMessageEl.style.visibility = roundEnded ? 'hidden' : 'initial'
  messageEl.style.color = roundEnded ? 'black' : 'rgba(245, 245, 245, 0.6)'

  remainingTreasureDisplay.style.visibility =
    roundEnded && !templeCollapse ? 'hidden' : 'initial'
  collapseProbabilityDisplay.style.visibility = roundEnded
    ? 'hidden'
    : 'initial'
}

const renderScore = () => {
  playerTotalEl.innerText = player.totalScore
  playerRoundEl.innerText = player.roundScore
  jonesTotalEl.innerText = jones.totalScore
  jonesRoundEl.innerText = jones.roundScore
  oConnelTotalEl.innerText = oConnel.totalScore
  oConnelRoundEl.innerText = oConnel.roundScore
}

const renderControls = () => {
  playerChoices.style.visibility =
    player.ran || roundEnded ? 'hidden' : 'initial'
  startGame.style.visibility = gameEnded ? 'initial' : 'hidden'
  startRound.style.visibility = roundEnded && !gameEnded ? 'initial' : 'hidden'
  homePage.style.visibility = gameEnded ? 'initial' : 'hidden'
}

const render = () => {
  renderElements()
  renderScore()
  renderControls()
}

const init = () => {
  round = 0
  winner = null
  gameEnded = false
  roundEnded = true
  player = {
    totalScore: 0,
    roundScore: 0,
    move: null,
    ran: false,
    name: 'You'
  }
  jones = {
    totalScore: 0,
    roundScore: 0,
    move: null,
    ran: false,
    name: 'Jones'
  }
  oConnel = {
    totalScore: 0,
    roundScore: 0,
    move: null,
    ran: false,
    name: "O'Connel"
  }
  characters = [player, jones, oConnel]
  artifacts = [
    'Artifact: 10',
    'Artifact: 10',
    'Artifact: 5',
    'Artifact: 5',
    'Artifact: 5'
  ]
  render()
}

//Fisher-Yates shuffle algorithm: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
const deckInit = () => {
  let roundDeck = [...cards]
  let roundArtifact = artifacts.pop()
  roundDeck.push(roundArtifact)

  for (let i = roundDeck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[roundDeck[i], roundDeck[j]] = [roundDeck[j], roundDeck[i]]
  }
  return roundDeck
}

const sortedMoves = () => {
  let movesObject = {
    cont: { count: 0, players: [] },
    run: { count: 0, players: [] }
  }

  characters.forEach((character) => {
    if (character.move) {
      if (character.ran) {
        movesObject.run.count += 1
        movesObject.run.players.push(character.name)
      } else {
        movesObject.cont.count += 1
        movesObject.cont.players.push(character.name)
      }
    }
  })

  return movesObject
}

const updateMessage = (delay = 1000) => {
  if (currentEvent) {
    priorEventsEl.innerHTML += eventObjects[eventType(currentEvent)].img
    currentEventEl.innerHTML = ''
  }
  eventMessageEl.innerText = ''

  let movesSummary = sortedMoves()

  if (
    movesSummary.cont.count === characters.length ||
    movesSummary.run.count === characters.length
  ) {
    messageEl.innerText = `All three adventurers ${
      movesSummary.cont.count === characters.length
        ? 'descend further into the temple'
        : 'return to the surface'
    }...`
  } else if (movesSummary.cont.count > 0 && movesSummary.run.count > 0) {
    messageEl.innerText = `${movesSummary.run.players.join(
      ' and '
    )} return to the surface while ${movesSummary.cont.players.join(
      ' and '
    )} continue onward...`
  } else if (movesSummary.cont.count > 0) {
    messageEl.innerText = `${movesSummary.cont.players.join(
      ' and '
    )} continue onward...`
  } else if (movesSummary.run.count > 0) {
    messageEl.innerText = `${movesSummary.run.players.join(
      ' and '
    )} return to the surface...`
  } else {
    messageEl.innerText = 'All three adventurers enter the ancient temple...'
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

//DRY event type and new event functions
const eventType = (event) => {
  if (event.includes('Treasure')) {
    return 'Treasure'
  } else if (event.includes('Artifact')) {
    return 'Artifact'
  } else {
    return event.split(' ')[1]
  }
}

const newEvent = () => {
  currentEvent = deck.pop()
  playedCards.push(currentEvent)
  let newEvent = eventType(currentEvent)
  currentEventEl.innerHTML = eventObjects[newEvent].img
  let value = +currentEvent.split(' ')[1]
  if (newEvent === 'Treasure') {
    eventMessageEl.innerText = `...and find ${value} treasure${
      value > 1 ? "'s" : ''
    }`
  } else if (newEvent === 'Artifact') {
    eventMessageEl.innerText = `... and find a ${
      value === 5 ? 'small artifact (5)!' : 'large artifact (10)!'
    }`
  } else {
    eventMessageEl.innerText = eventObjects[newEvent].desc
  }
}

const initRound = async () => {
  startRound.style.visibility = 'hidden'
  round += 1

  characters.forEach((character) => {
    character.roundScore = 0
    character.move = null
    character.ran = false
  })

  remainingTreasure = 0
  roundEnded = false
  templeCollapse = false

  deck = deckInit()
  playedCards = []
  currentEvent = null
  gameState.innerText = `Round ${round}/5`
  priorEventsEl.innerHTML = 'Prior events:'
  remainingTreasureDisplay.style.visibility = 'hidden'
  await updateMessage()
  runEvent()
  render()
}

const remainingPlayers = () => {
  let remainingPlayers = { count: 0, players: [] }
  characters.forEach((character) => {
    if (!character.ran) {
      remainingPlayers.count += 1
      remainingPlayers.players.push(character.name)
    }
  })

  return remainingPlayers
}

const divideTreasure = () => {
  let value = +currentEvent.split(' ')[1]
  let playerCount = remainingPlayers().count
  let treasureSplit = Math.floor(value / playerCount)

  characters.forEach((character) => {
    character.roundScore += character.ran ? 0 : treasureSplit
  })

  remainingTreasure += value % playerCount
}

const checkForCollapse = () => {
  if (playedCards.slice(0, playedCards.length - 1).includes(currentEvent)) {
    templeCollapse = true
    roundEnded = true
    characters.forEach((character) => {
      character.roundScore = 0
    })
  }
}

const collapseProbability = () => {
  let hazards = 0
  playedCards.forEach((card) => {
    if (card.includes('Hazard')) hazards += 1
  })
  return (hazards * 2) / deck.length
}

const updateGameElements = () => {
  if (roundEnded && remainingPlayers().count > 0) {
    remainingTreasureDisplay.innerHTML = '<b>The temple begins to collapse<b>'
    collapseProbabilityDisplay.innerText = ''
  } else {
    remainingTreasureDisplay.innerHTML = `Remaining Treasure: ${remainingTreasure}`
    collapseProbabilityDisplay.innerText = `Collapse Probability: ${Math.floor(
      collapseProbability() * 100
    )}%`
  }
}

const runEvent = () => {
  newEvent()
  if (currentEvent.includes('Treasure')) {
    divideTreasure()
  } else {
    checkForCollapse()
  }
  updateGameElements()
}

const scoreRound = () => {
  let runCount = 0
  let artifactBonus = 0

  characters.forEach((character) => {
    if (character.move === 'run') runCount += 1
  })

  if (runCount > 1) {
    remainingTreasure = 0
  }
  if (runCount === 1 && currentEvent.includes('Artifact')) {
    artifactBonus = +currentEvent.split(' ')[1]
  }

  characters.forEach((character) => {
    if (character.move === 'run') {
      character.totalScore +=
        character.roundScore + remainingTreasure + artifactBonus
      character.roundScore = 0
      remainingTreasure = 0
      character.ran = true
    }
  })
}

//DRY here
const checkWinner = () => {
  if (
    player.totalScore > jones.totalScore &&
    player.totalScore > oConnel.totalScore
  ) {
    winner = 'You'
  } else if (
    jones.totalScore > player.totalScore &&
    jones.totalScore > oConnel.totalScore
  ) {
    winner = 'Jones'
  } else if (
    oConnel.totalScore > jones.totalScore &&
    oConnel.totalScore > player.totalScore
  ) {
    winner = "O'Connel"
  } else {
    winner = 'tie'
  }
  gameState.innerText = winnerMessages[winner]
}

const gameStatus = () => {
  if (!roundEnded) {
    roundEnded = characters.every((character) => {
      return character.ran
    })
  }
  gameEnded = roundEnded && round === 5 ? true : false
  if (gameEnded) checkWinner()
}

//clean this up
const playerDescisionExpectation = () => {
  let playerCount = remainingPlayers().count
  let outcomes = {
    allCont: 0,
    twoCont: 0,
    oneCont: 0
  }

  if (playerCount === 3) {
    outcomes = {
      allCont: 0.25,
      twoCont: 0.5,
      oneCont: 0.25
    }
  } else if (playerCount === 2) {
    outcomes = {
      allCont: 0,
      twoCont: 0,
      oneCont: 1
    }
  } else {
    outcomes = {
      allCont: 0,
      twoCont: 0.5,
      oneCont: 0.5
    }
  }
  return outcomes
}

const onlyPlayerRuns = () => {
  let playerCount = remainingPlayers().count

  return 0.5 ** (playerCount - 1)
}

const computerDescision = (character, delay = 0) => {
  let outcomesContinue = []
  let outcomesRun = []
  let expectedDescisions = playerDescisionExpectation()

  //continue
  deck.forEach((card) => {
    if (card.includes('Treasure')) {
      let value = +card.split(' ')[1]
      let expectedValue =
        value * expectedDescisions.oneCont +
        Math.floor(value / 2) * expectedDescisions.twoCont +
        Math.floor(value / 3) * expectedDescisions.allCont
      outcomesContinue.push(expectedValue)
    } else if (playedCards.includes(card)) {
      outcomesContinue.push(-character.roundScore * (1.5 - Math.random()))
    } else {
      outcomesContinue.push(0)
    }
  })

  //run
  let artifactBonus = currentEvent.includes('Artifact')
    ? +currentEvent.split(' ')[1]
    : 0
  outcomesRun.push((remainingTreasure + artifactBonus) * onlyPlayerRuns())

  let continueEV =
    outcomesContinue.reduce((acc, outcome) => acc + outcome, 0) /
    outcomesContinue.length
  let descision = continueEV >= outcomesRun[0] ? 'continue' : 'run'
  console.log(outcomesContinue, outcomesRun, continueEV)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(descision)
    }, delay)
  })
}

const computerDescisionAsync = async () => {
  while ((!jones.ran || !oConnel.ran) && !roundEnded) {
    let jonesDelay = oConnel.ran ? 2000 : 0

    player.move = null
    jones.move = jones.ran ? null : await computerDescision(jones, jonesDelay)
    oConnel.move = oConnel.ran ? null : await computerDescision(oConnel, 2000)

    remainingTreasureDisplay.style.visibility = 'hidden'
    collapseProbabilityDisplay.style.visibility = 'hidden'
    scoreRound()
    await updateMessage(1000)
    if (!jones.ran || !oConnel.ran) runEvent()
    gameStatus()
    render()
  }
}

const handleDescision = async (e) => {
  if (e.target.tagName !== 'DIV') return

  playerChoices.style.visibility = 'hidden'
  remainingTreasureDisplay.style.visibility = 'hidden'
  collapseProbabilityDisplay.style.visibility = 'hidden'

  player.move = e.target.className
  jones.move = jones.ran ? null : await computerDescision(jones)
  oConnel.move = oConnel.ran ? null : await computerDescision(oConnel)

  scoreRound()
  await updateMessage()

  if (!player.ran || !jones.ran || !oConnel.ran) runEvent()
  gameStatus()
  render()
  if (player.ran && (!jones.ran || !oConnel.ran) && !roundEnded) {
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
