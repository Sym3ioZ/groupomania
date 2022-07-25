const express = require('express')
require('dotenv').config()
const cors = require('cors')

const userRoutes = require('./routes/user')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/auth', userRoutes)

module.exports = app
