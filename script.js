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

  function showQuizzes() {
    let quizList = JSON.parse(localStorage.getItem('quizzes') || '[]')
    let listDiv = document.querySelector('.quiz-list')
    listDiv.innerHTML = ''
    quizList.forEach((quiz, i) => {
      let btn = document.createElement('button')
      btn.innerText = quiz.title
      btn.className = 'quiz-btn'
      btn.onclick = () => startQuiz(i)
      listDiv.appendChild(btn)
    })
  }
  function startQuiz(index) {
    currentQuiz = index
    let quizData = JSON.parse(localStorage.getItem('quizzes'))[index]
    document.querySelector('.home').style.display = 'none'
    document.querySelector('.quiz-page').style.display = 'block'
    document.querySelector('.quiz-title').innerText = quizData.title
    let qDiv = document.querySelector('.questions')
    qDiv.innerHTML = ''
    quizData.questions.forEach((q, qi) => {
      let qBox = document.createElement('div')
      qBox.className = 'question'
      qBox.innerText = q.q
      q.options.forEach((opt, oi) => {
        let radio = document.createElement('input')
        radio.type = 'radio'
        radio.name = 'q' + qi
        radio.value = opt
        qBox.appendChild(document.createTextNode(opt))
        qBox.appendChild(radio)
      })
      qDiv.appendChild(qBox)
    })
  }


  function submitQuiz() {
    let quizData = JSON.parse(localStorage.getItem('quizzes'))[currentQuiz]
    let total = quizData.questions.length
    let score = 0
    quizData.questions.forEach((q, qi) => {
      let selected = document.querySelector('input[name="q' + qi + '"]:checked')
      if (selected && selected.value == q.ans) score++
    })
    document.querySelector('.score-text').innerText = 'You got ' + score + ' out of ' + total
    let users = JSON.parse(localStorage.getItem('users'))
    let u = users.find(x => x.email == currentUser.email)
    u.scores[quizData.title] = score
    localStorage.setItem('users', JSON.stringify(users))
  }
  
  function showDashboard() {
    let users = JSON.parse(localStorage.getItem('users') || '[]')
    let box = document.querySelector('.user-scores')
    box.innerHTML = ''
    users.forEach(u => {
      let div = document.createElement('div')
      div.innerText = u.email + ' - ' + JSON.stringify(u.scores)
      box.appendChild(div)
    })
  }