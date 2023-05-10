/*----- cached elements  -----*/
const body = document.querySelector('body')
const header = document.querySelector('header')
const promt = document.querySelector('#gamePromt')
const rules = document.querySelector('article')
const ruleList = document.querySelector('ul')
const startGame = document.querySelector('#startGame')

const toggleDarkMode = (e) => {
  e.target.classList.toggle('dark')
  e.target.innerText = e.target.innerText.includes('Dark')
    ? 'Light Mode'
    : 'Dark Mode'
  body.classList.toggle('dark')
  header.classList.toggle('dark')
  promt.classList.toggle('dark')
  rules.classList.toggle('dark')
  ruleList.classList.toggle('dark')
  startGame.classList.toggle('dark')
}

document.querySelector('#toggleDark').addEventListener('click', toggleDarkMode)
