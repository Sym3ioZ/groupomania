const express = require('express');
require('dotenv').config();  // To use environment vars (secures sensible data such as the DB connection string)

const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

module.exports = app;