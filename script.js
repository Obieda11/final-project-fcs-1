
let loginForm = document.querySelector('.form#loginForm')
let registerForm = document.querySelector('.form#registerForm')
let authContainer = document.querySelector('.container#auth')
let homeContainer = document.querySelector('.container#home')
let quizPage = document.querySelector('.container#quizPage')
let dashboardPage = document.querySelector('.container#dashboard')
let authMessage = document.querySelector('.message')
let tabButtons = document.querySelectorAll('.tab-btn')
let logoutBtns = document.querySelectorAll('.logout-btn')
let quizList = document.querySelector('#quizList')
let quizForm = document.querySelector('#quizForm')
let quizTitle = document.querySelector('.quiz-title')
let scoreResult = document.querySelector('#scoreResult')
let userList = document.querySelector('#userList')
let userNameDisplay = document.querySelector('.userName')


if (!localStorage.getItem('quizzes')) {
  localStorage.setItem('quizzes', JSON.stringify([
    {
      title: 'Astronomy',
      questions: [
        { q: 'Which planet is known as the "Red Planet"?', options: ['Venus', 'Mars', 'Jupitor'], ans: 'Mars' },
        { q: 'What is the largest planet in our solar system?', options: ['Saturn', 'Earth', 'Jupitor'], ans: 'Jupitor' },
        { q: 'Which celestial body is classified as a dwarf planet?', options: ['Pluto', 'Mercury', 'Titan'], ans: 'Pluto' }
      ]
    },
    {
      title: 'Football',
      questions: [
        { q: 'who is the best football player', options: ['C.ronaldo', 'Messi', 'Mo salah'], ans: 'Messi' },
        { q: 'who won football world cup in 2025', options: ['Spain', 'Lebanon', 'No body'], ans: 'No body' },
        { q: 'Which country invented soccer?', options: ['England', 'Spain', 'Portugal'], ans: 'England' }
      ]
    }
  ]))
}


tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.tab === 'login') {
      loginForm.classList.remove('hidden')
      registerForm.classList.add('hidden')
      authMessage.innerText = ''
    } else {
      registerForm.classList.remove('hidden')
      loginForm.classList.add('hidden')
      authMessage.innerText = ''
    }
  })
})


document.querySelector('.loginBtn').addEventListener('click', () => {
  let email = loginForm.querySelector('.email').value
  let pass = loginForm.querySelector('.password').value
  let users = JSON.parse(localStorage.getItem('users') || '[]')

  let found = users.find(u => u.email === email && u.password === pass)
  if (email === 'admin@quiz.com' && pass === 'admin123') {
    showDashboard()
  } else if (found) {
    localStorage.setItem('loggedInUser', JSON.stringify(found))
    showHome(found.username)
  } else {
    authMessage.innerText = 'Wrong email or password!'
  }
})


document.querySelector('.registerBtn').addEventListener('click', () => {
  let username = registerForm.querySelector('.username').value
  let email = registerForm.querySelector('.email').value
  let pass = registerForm.querySelector('.password').value

  if (!username || !email || !pass) {
    authMessage.innerText = 'Fill all fields!'
    return
  }

  let users = JSON.parse(localStorage.getItem('users') || '[]')
  if (users.some(u => u.email === email)) {
    authMessage.innerText = 'Email already used!'
    return
  }

  let newUser = { username, email, password: pass, scores: {} }
  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  authMessage.innerText = 'Registered! Now login.'
  loginForm.classList.remove('hidden')
  registerForm.classList.add('hidden')
})


function showHome(name) {
  authContainer.classList.add('hidden')
  dashboardPage.classList.add('hidden')
  quizPage.classList.add('hidden')
  homeContainer.classList.remove('hidden')
  userNameDisplay.innerText = name
  renderQuizzes()
}


function showDashboard() {
  authContainer.classList.add('hidden')
  homeContainer.classList.add('hidden')
  quizPage.classList.add('hidden')
  dashboardPage.classList.remove('hidden')

  let users = JSON.parse(localStorage.getItem('users') || '[]')
  userList.innerHTML = ''
  users.forEach(u => {
    let div = document.createElement('div')
    div.classList.add('user-card')
    let html = `<div class="user-name">${u.username} (${u.email})</div>`
    let scores = Object.entries(u.scores || {}).map(([quiz, score]) => `<div>${quiz}: ${score}/3</div>`).join('')
    div.innerHTML = html + scores
    userList.appendChild(div)
  })
}


function renderQuizzes() {
  quizList.innerHTML = ''
  let quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]')
  quizzes.forEach((quiz, idx) => {
    let btn = document.createElement('button')
    btn.classList.add('quiz-btn')
    btn.innerText = quiz.title
    btn.addEventListener('click', () => startQuiz(idx))
    quizList.appendChild(btn)
  })
}


function startQuiz(index) {
  homeContainer.classList.add('hidden')
  quizPage.classList.remove('hidden')
  scoreResult.innerText = ''
  let quiz = JSON.parse(localStorage.getItem('quizzes'))[index]
  quizTitle.innerText = quiz.title
  quizForm.innerHTML = ''
  quiz.questions.forEach((q, i) => {
    let box = document.createElement('div')
    box.classList.add('question-box')
    let question = `<div><strong>${q.q}</strong></div>`
    let options = q.options.map(opt => {
      return `<label class="option-label"><input type="radio" name="q${i}" value="${opt}"> ${opt}</label>`
    }).join('')
    box.innerHTML = question + options
    quizForm.appendChild(box)
  })

  document.querySelector('.submit-btn').onclick = () => {
    let score = 0
    quiz.questions.forEach((q, i) => {
      let selected = quizForm.querySelector(`input[name="q${i}"]:checked`)
      if (selected && selected.value === q.ans) score++
    })

    let user = JSON.parse(localStorage.getItem('loggedInUser'))
    let users = JSON.parse(localStorage.getItem('users') || '[]')
    let updateUser = users.find(u => u.email === user.email)
    if (!updateUser.scores) updateUser.scores = {}
    updateUser.scores[quiz.title] = score
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('loggedInUser', JSON.stringify(updateUser))

    scoreResult.innerText = `You got ${score} out of 3!`
  }
}


logoutBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser')
    window.location.reload()
  })
})
