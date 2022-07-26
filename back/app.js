const express = require('express')
require('dotenv').config()
const cors = require('cors')

const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/auth', userRoutes)
app.use('/api/posts', postRoutes)

module.exports = app
