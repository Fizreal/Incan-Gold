/*----- cached elements  -----*/
const body = document.querySelector('body')
const header = document.querySelector('header')
const promt = document.querySelector('#gamePromt')
const rules = document.querySelector('article')
const ruleList = document.querySelector('ul')
const startGame = document.querySelector('#startGame')
const toggleButton = document.querySelector('#toggleDark')

const toggleDarkMode = (e) => {
  toggleButton.classList.toggle('dark')
  toggleButton.innerText = toggleButton.innerText.includes('Dark')
    ? 'Light Mode'
    : 'Dark Mode'
  body.classList.toggle('dark')
  header.classList.toggle('dark')
  promt.classList.toggle('dark')
  rules.classList.toggle('dark')
  ruleList.classList.toggle('dark')
  startGame.classList.toggle('dark')

  if (e) {
    localStorage.darkMode = localStorage.darkMode === 'off' ? 'on' : 'off'
  }
}

document.querySelector('#toggleDark').addEventListener('click', toggleDarkMode)

const setDarkMode = () => {
  if (!localStorage.darkMode) {
    localStorage.darkMode = 'off'
  } else if (localStorage.darkMode === 'on') {
    toggleDarkMode()
  }
}

setDarkMode()
