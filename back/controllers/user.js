const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2')
const connection = mysql.connect(function (error) {
  if (error) throw error
  else console.log('connected to GROUPOMANIA database!')
})

exports.login = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const createUser = "INSERT INTO user (id, mail, password, name, firstName, sector, bio, role"
  })
}
