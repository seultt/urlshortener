const express = require('express')
const morgan = require('morgan')
const basicAuth = require('express-basic-auth')
const randomstring = require('randomstring')
const bodyParser = require('body-parser')

const data = [
  {longUrl: 'http://google.com', 
  id: randomstring.generate(6) }
] // 데이타 구조

// http://localhost:3000/58DX37
// 302 응답
// 

const app = express()
//로그인 안하면 막는 기능
const authMiddleware = basicAuth({
    users: { 'admin': 'admin' },
    challenge: true,
    realm: 'Imb4T3st4pp'
})

// form 데이터 전송 body에 URL에 인코딩 전송된 특별한 형식을 자바스크립트로 변경
const bodyParserMiddleware = bodyParser.urlencoded({extended: false})




app.set('view engine', 'ejs') // express가 자동으로 ejs를 불러옴
app.use('/static', express.static('public'))
app.use(morgan('tiny'))

app.get('/', authMiddleware, (req, res)=> {
  res.render('index.ejs', {data})
})

app.get('/:id', (req, res) => {
  const id = req.params.id
  const matched = data.find(item => item.id === id)
  if (matched) {
    res.redirect(301, matched.longUrl)
  } else {
    res.status(404)
    res.send('404 Not Found')
  }
})

//form 전송방법
app.post('/', authMiddleware, bodyParserMiddleware, (req, res)=> {
  const longUrl = req.body.longUrl
  let id
  while (true) {
    const candidate = randomstring.generate(6)
    const matched = data.find(item => item.id === candidate)
    if (!matched) { //matched가 없다면 id에 candidate를 저장하라
      id = candidate
      break
    }
  }
  data.push({id, longUrl}) //data에  덮어씌어라 
  // 자바스크립트는 객체 속성의 순서가 보장이 되지 않으므로 순서는 상관이 없다.
  res.redirect('/')
})

app.listen(3012, () => {
  console.log('listening...')
})

