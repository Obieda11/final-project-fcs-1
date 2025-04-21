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


  function loginUser() {
    let email = document.querySelector('.login-email').value
    let pass = document.querySelector('.login-pass').value
    let users = JSON.parse(localStorage.getItem('users') || '[]')
    let found = users.find(u => u.email == email && u.pass == pass)
    if (email == 'admin@quiz.com' && pass == 'admin123') {
      document.querySelector('.auth').style.display = 'none'
      document.querySelector('.dashboard').style.display = 'block'
      showDashboard()
    } else if (found) {
      currentUser = found
      document.querySelector('.auth').style.display = 'none'
      document.querySelector('.home').style.display = 'block'
      document.querySelector('.user-name').innerText = found.email
      showQuizzes()
    } else {
      alert('wrong info')
    }
  }