let currentUser = null
let currentQuiz = null

function showTab(name) {
  document.querySelector('.login').classList.remove('active-tab')
  document.querySelector('.register').classList.remove('active-tab')
  document.querySelector('.' + name).classList.add('active-tab')
}