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

const createTableUser =
  "CREATE TABLE IF NOT EXISTS user ('id' INT not null AUTO_INCREMENT, 'mail' VARCHAR(255) UNIQUE REQUIRED, 'password' VARCHAR(1023) REQUIRED, 'name' VARCHAR(255) REQUIRED, 'firstName' VARCHAR(255) REQUIRED, 'sector' VARCHAR(255) REQUIRED, 'bio' VARCHAR(1023) DEFAULT '', 'profilePic' VARCHAR(255) DEFAULT '', 'role' VARCHAR(16) DEFAULT 'user', PRIMARY KEY ('id'))"

const createTablePost =
  "CREATE TABLE IF NOT EXISTS post ('id' INT not null AUTO_INCREMENT, 'user_id' INT not null, 'text' VARCHAR(1023) REQUIRED, 'imageUrl' VARCHAR(255) DEFAULT '', 'likes' INT DEFAULT '0', 'createDate' DATE, 'modified' DATE, PRIMARY KEY ('id'))"

connection.query(createTableUser, function (err, res) {
  if (err) throw err
  console.log('user table created!')
})
connection.query(createTablePost, function (err, res) {
  if (err) throw err
  console.log('post table created!')
})

app.post('/api/signup', (req, res, next) => {
  console.log('POST OK')
  const mail = req.body.mail
  const pass = req.body.password
  console.log(mail)
  console.log(pass)
  const createUser =
    "INSERT INTO user (mail, password) VALUES ('" + mail + "', '" + pass + "')"
  connection.query(createUser, function (err, res) {
    if (err) throw err
    console.log('User created!')
  })
  return res.status(201).json({ message: 'POST réussi!' })
})
app.get('/api', (req, res, next) => {
  console.log('TEST OK OKOK')
  return res.status(200).json({ message: 'TEST OK GET' })
})

module.exports = app
