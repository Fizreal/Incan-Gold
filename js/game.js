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
] //update to create using a card class?

const winnerMessages = {
  tie: 'No winner, well played.',
  player: "Congratulations, you've won!",
  jones: 'Dr. Jones won, nice try.',
  oConnel: "O'Connel won, nice try."
}

/*----- state variables -----*/
let round
let winner
let player
let jones
let oConnel
let remainingTreasure

let playerRan
let jonesRan
let oConnelRan

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
    playerRan || roundEnded ? 'hidden' : 'initial'
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
  playerRan = false
  computerRan = false
  roundEnded = true
  player = {
    totalScore: 0,
    roundScore: 0
  }
  jones = {
    totalScore: 0,
    roundScore: 0
  }
  oConnel = {
    totalScore: 0,
    roundScore: 0
  }
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

const sortedMoves = (playerMove, jonesMove, oConnelMove) => {
  let movesObject = {
    cont: { count: 0, players: [] },
    run: { count: 0, players: [] }
  }

  if (playerMove) {
    if (playerRan) {
      movesObject.run.count += 1
      movesObject.run.players.push('You')
    } else {
      movesObject.cont.count += 1
      movesObject.cont.players.push('You')
    }
  }
  if (jonesMove) {
    if (jonesRan) {
      movesObject.run.count += 1
      movesObject.run.players.push('Jones')
    } else {
      movesObject.cont.count += 1
      movesObject.cont.players.push('Jones')
    }
  }
  if (oConnelMove) {
    if (oConnelRan) {
      movesObject.run.count += 1
      movesObject.run.players.push("O'Connel")
    } else {
      movesObject.cont.count += 1
      movesObject.cont.players.push("O'Connel")
    }
  }

  return movesObject
}

const updateMessage = (playerMove, jonesMove, oConnelMove, delay = 1000) => {
  if (currentEvent) {
    priorEventsEl.innerHTML += eventObjects[eventType(currentEvent)].img
    currentEventEl.innerHTML = ''
  }
  eventMessageEl.innerText = ''

  let movesSummary = sortedMoves(playerMove, jonesMove, oConnelMove)

  if (movesSummary.cont.count === 3 || movesSummary.run.count === 3) {
    messageEl.innerText = `All three adventurers ${
      movesSummary.cont.count === 3
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
  player.roundScore = 0
  jones.roundScore = 0
  oConnel.roundScore = 0
  remainingTreasure = 0
  playerRan = false
  jonesRan = false
  oConnelRan = false
  roundEnded = false
  templeCollapse = false

  deck = deckInit()
  playedCards = []
  currentEvent = null
  gameState.innerText = `Round ${round}/5`
  priorEventsEl.innerHTML = 'Prior events:'
  remainingTreasureDisplay.style.visibility = 'hidden'
  await updateMessage(null, null, null)
  runEvent()
  render()
}

//Use this in other functions
const remainingPlayers = () => {
  let remainingPlayers = { count: 0, players: [] }
  if (!playerRan) {
    remainingPlayers.count += 1
    remainingPlayers.players.push('You')
  }
  if (!jonesRan) {
    remainingPlayers.count += 1
    remainingPlayers.players.push('Jones')
  }
  if (!oConnelRan) {
    remainingPlayers.count += 1
    remainingPlayers.players.push("O'Connel")
  }
  return remainingPlayers
}

const divideTreasure = () => {
  let value = +currentEvent.split(' ')[1]
  let playerCount = remainingPlayers().count
  let treasureSplit = Math.floor(value / playerCount)

  player.roundScore += playerRan ? 0 : treasureSplit
  jones.roundScore += jonesRan ? 0 : treasureSplit
  oConnel.roundScore += oConnelRan ? 0 : treasureSplit
  remainingTreasure += value % playerCount
}

const checkForCollapse = () => {
  if (playedCards.slice(0, playedCards.length - 1).includes(currentEvent)) {
    templeCollapse = true
    roundEnded = true
    player.roundScore = 0
    jones.roundScore = 0
    oConnel.roundScore = 0
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

//Rename this function
const scoreRound = (pMove, jMove, oMove) => {
  let runCount = 0
  let artifactBonus = 0
  if (pMove === 'run') runCount += 1
  if (jMove === 'run') runCount += 1
  if (oMove === 'run') runCount += 1

  if (runCount > 1) {
    remainingTreasure = 0
  }
  if (runCount === 1 && currentEvent.includes('Artifact')) {
    artifactBonus = +currentEvent.split(' ')[1]
  }
  if (pMove === 'run') {
    player.totalScore += player.roundScore + remainingTreasure + artifactBonus
    player.roundScore = 0
    remainingTreasure = 0
    playerRan = true
  }
  if (jMove === 'run') {
    jones.totalScore += jones.roundScore + remainingTreasure + artifactBonus
    jones.roundScore = 0
    remainingTreasure = 0
    jonesRan = true
  }
  if (oMove === 'run') {
    oConnel.totalScore += oConnel.roundScore + remainingTreasure + artifactBonus
    oConnel.roundScore = 0
    remainingTreasure = 0
    oConnelRan = true
  }
}

const checkWinner = () => {
  if (
    player.totalScore > jones.totalScore &&
    player.totalScore > oConnel.totalScore
  ) {
    winner = 'player'
  } else if (
    jones.totalScore > player.totalScore &&
    jones.totalScore > oConnel.totalScore
  ) {
    winner = 'jones'
  } else if (
    oConnel.totalScore > jones.totalScore &&
    oConnel.totalScore > player.totalScore
  ) {
    winner = 'oConnel'
  } else {
    winner = 'tie'
  }
  gameState.innerText = winnerMessages[winner]
}

const gameStatus = () => {
  if (!roundEnded) {
    roundEnded = playerRan && jonesRan && oConnelRan ? true : false
  }
  gameEnded = roundEnded && round === 5 ? true : false
  if (gameEnded) checkWinner()
}

//clean this up & improve the run estimates from just 50/50
const playerDescisionExpectation = (opp1Ran, opp2Ran) => {
  let outcomes = {
    allCont: 0,
    twoCont: 0,
    oneCont: 0
  }

  if (!opp1Ran && !opp2Ran) {
    outcomes = {
      allCont: 0.25,
      twoCont: 0.5,
      oneCont: 0.25
    }
  } else if (opp1Ran && opp2Ran) {
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

const onlyPlayerRuns = (opp1Ran, opp2Ran) => {
  if (opp1Ran && opp2Ran) {
    return 1
  } else if (!opp1Ran && !opp2Ran) {
    return 0.25
  } else {
    return 0.5
  }
}

//use this function for both computer moves, add a parameter for riskAversion to differentiate their behaviour
const oConnelDescision = (delay = 0) => {
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
      outcomesContinue.push(-oConnel.roundScore)
    } else {
      outcomesContinue.push(0)
    }
  })

  //run
  let artifactBonus = currentEvent.includes('Artifact')
    ? +currentEvent.split(' ')[1]
    : 0
  outcomesRun.push(
    (remainingTreasure + artifactBonus) * onlyPlayerRuns(playerRan, jonesRan)
  )

  let continueEV =
    outcomesContinue.reduce((acc, outcome) => acc + outcome, 0) /
    outcomesContinue.length
  let descision = continueEV >= outcomesRun[0] ? 'continue' : 'run'
  // console.log(, outcomesContinue, outcomesRun, continueEV)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(descision)
    }, delay)
  })
}

const jonesDescision = (delay = 0) => {
  let outcomesContinue = []
  let expectedDescisions = playerDescisionExpectation()

  deck.forEach((card) => {
    if (card.includes('Treasure')) {
      let value = +card.split(' ')[1]
      let expectedValue =
        value * expectedDescisions.oneCont +
        Math.floor(value / 2) * expectedDescisions.twoCont +
        Math.floor(value / 3) * expectedDescisions.allCont
      outcomesContinue.push(expectedValue)
    } else if (playedCards.includes(card)) {
      outcomesContinue.push(-jones.roundScore)
    } else {
      outcomesContinue.push(0)
    }
  })
  let continueEV =
    outcomesContinue.reduce((acc, outcome) => acc + outcome, 0) /
    outcomesContinue.length
  let descision = continueEV >= 0 ? 'continue' : 'run'
  // console.log('jones', outcomesContinue, continueEV)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(descision)
    }, delay)
  })
}

const computerDescisionAsync = async () => {
  while ((!jonesRan || !oConnel) && !roundEnded) {
    let jonesDelay = oConnelRan ? 2000 : 0

    let jonesMove = jonesRan ? null : await jonesDescision(jonesDelay)
    let oConnelMove = oConnelRan ? null : await oConnelDescision(2000)

    remainingTreasureDisplay.style.visibility = 'hidden'
    collapseProbabilityDisplay.style.visibility = 'hidden'
    scoreRound(null, jonesMove, oConnelMove)
    await updateMessage(null, jonesMove, oConnelMove, 1000)
    if (!jonesRan || !oConnelRan) runEvent()
    gameStatus()
    render()
  }
}

const handleDescision = async (e) => {
  if (e.target.tagName !== 'DIV') return

  playerChoices.style.visibility = 'hidden'
  remainingTreasureDisplay.style.visibility = 'hidden'
  collapseProbabilityDisplay.style.visibility = 'hidden'

  let playerMove = e.target.className
  let jonesMove = jonesRan ? null : await jonesDescision()
  let oConnelMove = oConnelRan ? null : await oConnelDescision()

  scoreRound(playerMove, jonesMove, oConnelMove)
  await updateMessage(playerMove, jonesMove, oConnelMove)

  if (!playerRan || !jonesRan || !oConnelRan) runEvent()
  gameStatus()
  render()
  if (playerRan && (!jonesRan || !oConnelRan) && !roundEnded) {
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
