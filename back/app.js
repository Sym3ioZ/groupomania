const express = require('express')
require('dotenv').config()

const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

app.post('/api/test', (req,res,next) => {
  console.log("POST OK")
  return res.status(201).json({message: "POST réussi!" })
})
app.get('/api', (req, res, next) => {
  console.log('TEST OK OKOK')
  return res.status(200).json({ message: 'TEST OK GET' })
})
module.exports = app
