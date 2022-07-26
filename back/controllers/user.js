const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const connection = require('../db')

exports.signup = (req, res, next) => {
  connection.query(
    "SELECT * FROM user WHERE mail='" + req.body.mail + "'",
    function (err, resp) {
      if (resp.length > 0) {
        return res.status(401).json({ code: '401', message: 'Unauthorized: mail already used' })
      } else {
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            const createUser =
              "INSERT INTO user (mail, password, name, firstName, sector) VALUES ('" +
              req.body.mail +
              "','" +
              hash +
              "','" +
              req.body.name +
              "','" +
              req.body.firstName +
              "','" +
              req.body.sector +
              "')"
            connection.query(createUser, function (err, resp) {
              if (err) throw err
              console.log('user created and logged in!')
              return res.status(200).json({ code: '200', message: 'User created'})
            })
          })
          .catch((error) => res.status(500).json({ error }))
      }
    }
  )
}

exports.login = (req, res, next) => {
  connection.query(
    "SELECT * FROM user WHERE mail='" + req.body.mail + "'",
    function (err, resp) {
      if (err) throw err
      if (resp.length > 0) {
        bcrypt
          .compare(req.body.password, resp[0].password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ code: '401', message: "Invalid password"})
            }
            return res.status(200).json({
              userId: resp[0].id,
              token: jwt.sign(
                { userid: resp[0].id },
                process.env.TOKEN_STRING,
                { expiresIn: '24h' }
              ),
            })
          })
          .catch((error) => res.status(500).json({ error }))
      }
    }
  )
}
