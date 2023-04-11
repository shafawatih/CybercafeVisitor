let BMuser = [
  {
      username: "ugak-ugak",
      password: "1234",
      name: "amir",
      email: "amirwin966@gmail.com"
  },
  {
      username: "range rover",
      password: "5678",
      name: "harith",
      email: "harith12@gmail.com"
  },
  {
      username: "boogi3yninja",
      password: "4321",
      name: "afifi",
      email: "afifimercurial@gmail.com"
  },
  {
      username: "invader",
      password: "anep1234",
      name: "haniff",
      email: "anep90@gmail.com"
  },
]
function register(reqUsername,reqPassword,reqName,reqEmail){
  BMuser.push({
      username: reqUsername,
      password: reqPassword,
      name: reqName,
      email: reqEmail
  })
}

const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.post('/login', (req, res) => {
    console.log(req.body)

    let result = login(req.body.username,req.body.password)

    res.send(result)
})

function login(reqUsername, reqPassword) {
  let matchuser = BMuser.find (user => user.username == reqUsername)

  if (!matchuser) return "User not found!"
  if(matchuser.password == reqPassword){
      return matchuser
  } else {
      return "invalid password"
  }
}

app.post('/register', (req, res) => {
  let result = register(
    req.body.username,
    req.body.password,
    req.body.name,
    req.body.email
  )

    res.send(result)
})

app.get('/', (req, res) => {
  res.send('hello there')
})

app.get('/bye', (req, res) => {
    res.send('bye')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
