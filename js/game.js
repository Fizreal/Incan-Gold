/*----- constants -----*/
const eventImgs = {
  treasure: '',
  mummy: '',
  snakes: '',
  spiders: '',
  rockfall: '',
  fire: ''
}

/*----- state variables -----*/
let round // Round number
let winner // Game winner
let player // Object with the players total & round scores
let computer // Object with the computer total & round scores
let remainingTreasure // Any remainder that wasn't able to be split between the players

let playerRan // Has the player left the temple
let computerRan // Has the computer left the temple
let templeCollapse // Has the temple collapsed

let deck // The deck that will be used for the round
let playedCards // Cards that have already been played from the deck

/*----- cached elements  -----*/

const playerChoices = document.querySelectorAll('#playerChoices > div')
const messageEl = document.querySelector('#statusMessage') //who is continuing
const eventMessageEl = document.querySelector('#eventDescription') //description of current event
const currentEventEl = document.querySelector('#currentEvent')
const priorEventsEl = document.querySelector('#previousEvents')
const playerTotalEl = document.querySelector('#playerTotal')
const playerRoundEl = document.querySelector('#playerRound')
const computerTotalEl = document.querySelector('#computerTotal')
const computerRoundEl = document.querySelector('#computerRound')

/*----- functions -----*/
const renderEvent = () => {}

const renderScore = () => {}

const renderControls = () => {}

const render = () => {
  renderScore()
  renderEvent()
  renderControls()
}

const init = () => {}
const initRound = () => {}

/*----- event listeners -----*/
