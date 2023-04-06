const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.post('/login', (req, res) => {
    console.log(req.body)

    res.send('login')
})

app.get('/', (req, res) => {
  res.send('hello there')
})

app.get('/bye', (req, res) => {
    res.send('bye')
})

app.post('/register', (req, res) => {
    res.send('account created')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
