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
const jwt = require('jsonwebtoken');

app.use(express.json())

// login function

app.post('/login', (req, res) => {
    console.log(req.body)

    let result = login(
      req.body.username,
      req.body.password
      )
      
    let Token = generateToken(result)

    res.send(Token)
})

function login(reqUsername, reqPassword) {
  let matchuser = BMuser.find (
    user => user.username == reqUsername
    )

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


function generateToken(userData){
  const Token = jwt.sign(
    userData,
    'inipassword',
    {expiresIn :60}

  );
  return Token
};
/*function register(reqUsername,reqPassword,reqName,reqEmail)
*/
app.get('/', (req, res) => {
  res.send('hello there')
})

function verifyToken(req,res,next){
  let header = req.headers.authorization
  console.log(header)

  let Token = header.split(' ')[1]

  jwt.verify(Token,'inipassword',function(err,decoded){
    if(err){
      res.send("invalid token")
    }
    req.user = decoded
    next()
  });
}
app.get('/bye',verifyToken, (req,res,next) => {
    res.send('bye')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
