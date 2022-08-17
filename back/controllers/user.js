const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const connection = require('../db')

exports.signup = (req, res, next) => {
  connection.query(
    "SELECT * FROM user WHERE mail='" + req.body.mail + "'",
    function (err, resp) {
      if (resp.length > 0) {
        return res
          .status(401)
          .json({ code: '401', message: 'Unauthorized: mail already used' })
      } else {
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            connection.query(
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
                "')",
              function (err, resp) {
                if (err) throw err
                console.log('user created and logged in!')
                return res
                  .status(200)
                  .json({ code: '200', message: 'User created' })
              }
            )
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
              return res
                .status(401)
                .json({ code: '401', message: 'Invalid password' })
            }
            return res.status(200).json({
              code: '200',
              userId: resp[0].userId,
              token: jwt.sign(
                { userid: resp[0].userId },
                process.env.TOKEN_STRING,
                { expiresIn: '24h' }
              ),
            })
          })
          .catch((error) => res.status(500).json({ code: '500', error }))
      } else {
        return res.status(403).json({ code: '403', error: 'User not found' })
      }
    }
  )
}

exports.getProfile = (req, res, next) => {
  const params = req.params.id.replace(/:/g, '')
  connection.query(
    "SELECT * FROM user WHERE userId = '" + params + "'",
    function (err, resp) {
      if (err) throw err
      return res.status(200).json({ code: '200', response: resp })
    }
  )
}

exports.deleteProfile = (req, res, next) => {
  const params = req.params.id.replace(/:/g, '')
  connection.query(
    "DELETE FROM user WHERE userId='" + params + "'",
    function (err, resp) {
      if (err) throw err
      connection.query(
        "DELETE FROM post WHERE user_id='" + params + "'",
        function (err, resp) {
          if (err) throw err
        }
      )
      return res.status(200).json({ code: '200', message: 'User deleted' })
    }
  )
}

exports.updateProfile = (req, res, next) => {
  // connection.query(
  //   "UPDATE user SET mail='" +
  //     req.body.mail +
  //     "', name='" +
  //     req.body.name +
  //     "', firstName='" +
  //     req.body.firstName +
  //     "', sector='" +
  //     req.body.sector +
  //     "', bio='" +
  //     req.body.bio +
  //     "' WHERE id='" +
  //     req.body.userId +
  //     "'",
  //   function (err, resp) {
  //     if (err) throw err
  //   }
  // )
}
