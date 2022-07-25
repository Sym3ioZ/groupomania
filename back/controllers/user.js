const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2')

const connection = mysql.createConnection(process.env.DB_CONNECTION_STRING)

connection.connect(function (error) {
  if (error) throw error
  else console.log('connected to GROUPOMANIA database!')
})

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
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
    })
  })
}

exports.login = (req, res, next) => {
  console.log(req.body.mail + ' ' + req.body.password)
  connection.query('SELECT * FROM user', function (err, resp) {
    console.log(resp)
    console.log(resp[0].name)
    if (err) throw err
    for (let i = 0; i < resp.length; i++) {
      if (req.body.mail === resp[i].mail) {
        bcrypt
          .compare(req.body.password, resp[i].password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: '401' })
            }
            return res.status(200).json({
              userId: resp[i].id,
              token: jwt.sign(
                { userid: resp[i].id },
                process.env.TOKEN_STRING,
                { expiresIn: '24h' }
              ),
            })
          })
          .catch((error) => res.status(500).json({ error }))
      }
    }
  })
}
