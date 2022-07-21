const express = require('express')
const mysql = require('mysql2')
require('dotenv').config()

const cors = require('cors')
const app = express()
const connString = 'mysql://root:Moikoisen72!@localhost/groupomania'

app.use(express.json())
app.use(cors())

const connection = mysql.createConnection(connString)

connection.connect(function (error) {
  if (error) throw error
  else console.log('connected to GROUPOMANIA database!')
})

app.post('/api/signup', (req, res, next) => {
  console.log('POST OK')
  const mail = req.body.mail;
  const pass = req.body.password;
  console.log(mail);
  console.log(pass);
  const createUser = "INSERT INTO user (mail, password) VALUES ('" + mail + "', '" + pass + "')"
  connection.query(createUser, function(err, res) {
    if (err) throw err;
    console.log ("User created!")
  })
  return res.status(201).json({ message: 'POST réussi!' })
})
app.get('/api', (req, res, next) => {
  console.log('TEST OK OKOK')
  return res.status(200).json({ message: 'TEST OK GET' })
})
module.exports = app
