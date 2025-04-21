let currentUser = null
let currentQuiz = null

function showTab(name) {
  document.querySelector('.login').classList.remove('active-tab')
  document.querySelector('.register').classList.remove('active-tab')
  document.querySelector('.' + name).classList.add('active-tab')
}

function registerUser() {
    let email = document.querySelector('.register-email').value
    let pass = document.querySelector('.register-pass').value
    let users = JSON.parse(localStorage.getItem('users') || '[]')
    users.push({ email: email, pass: pass, scores: {} })
    localStorage.setItem('users', JSON.stringify(users))
    alert('registered')
  }