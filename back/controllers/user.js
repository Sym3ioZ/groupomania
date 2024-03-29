const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const connection = require('../db')
const fs = require('fs')

// Retrieving userId from token
exports.getUserId = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1] // Retrieves token from headers
  const decodedToken = jwt.verify(token, process.env.TOKEN_STRING) // Decodes token
  const userId = decodedToken.userId // Retrieves userId from the token object
  return res.status(200).json({ userId: userId })
}

// Inserting new user into user table
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
              "INSERT INTO user (mail, password, name, firstName, profilePic, sector) VALUES ('" +
                req.body.mail +
                "','" +
                hash +
                "','" +
                req.body.name +
                "','" +
                req.body.firstName +
                "','" +
                `${req.protocol}://${req.get('host')}/images/profilePics/${
                  req.file.filename
                }` +
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

// Checking user info to log him in
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
              // Returning code, userId, and token
              code: '200',
              userId: resp[0].userId,
              token: jwt.sign(
                { userId: resp[0].userId },
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

// Retrieving user profile
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

// Deletes user profile from user table, and all his posts and likes from post and likes tables
exports.deleteProfile = (req, res, next) => {
  const profilePic = req.body.profilePic
  const filename = profilePic.split('/profilePics/')[1]
  fs.unlink(`images/profilePics/${filename}`, () => {})
  connection.query(
    "DELETE FROM likes WHERE user_id='" + req.body.userId + "'",
    function (err, resp) {
      if (err) throw err
      connection.query(
        "SELECT * FROM post WHERE user_id='" + req.body.userId + "'",
        function (err, resp) {
          if (err) throw err
          if (resp.length > 0) {
            for (let i = 0; i < resp.length; i++) {
              let postPic = resp[i].imageUrl
              if (postPic) {
                let postFilename = postPic.split('/postPics/')[1]
                fs.unlink(`images/postPics/${postFilename}`, () => {})
              }
            }
          }
          connection.query(
            "DELETE FROM post WHERE user_id='" + req.body.userId + "'",
            function (err, resp) {
              if (err) throw err
              connection.query(
                "DELETE FROM user WHERE userId='" + req.body.userId + "'",
                function (err, resp) {
                  if (err) throw err
                }
              )
            }
          )
        }
      )
      return res.status(200).json({ code: '200', message: 'User deleted' })
    }
  )
}

// Updating user profile
exports.updateProfile = (req, res, next) => {
  if (req.body.newPwd) {
    // If a new password was entered, checking the old password for security
    connection.query(
      "SELECT * FROM user WHERE userId='" + req.body.userId + "'",
      function (err, resp) {
        if (err) throw err
        bcrypt
          .compare(req.body.oldPwd, resp[0].password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ code: '401', message: 'Invalid password' })
            } else {
              // If old password is correct, updating all data
              bcrypt
                .hash(req.body.newPwd, 10)
                .then((hash) => {
                  if (req.file) {
                    const profilePic = req.body.profilePic
                    const filename = profilePic.split('/profilePics/')[1]
                    fs.unlink(`images/profilePics/${filename}`, () => {})
                    connection.query(
                      "UPDATE user SET name='" +
                        req.body.userName.toUpperCase() +
                        "', firstName='" +
                        req.body.userFirstName.charAt(0).toUpperCase() +
                        req.body.userFirstName.slice(1) +
                        "', password='" +
                        hash +
                        "', profilePic='" +
                        `${req.protocol}://${req.get(
                          'host'
                        )}/images/profilePics/${req.file.filename}` +
                        "', sector='" +
                        req.body.userSector +
                        "' WHERE userId ='" +
                        req.body.userId +
                        "'",
                      function (err, resp) {
                        if (err) throw err
                        return res
                          .status(200)
                          .json({ message: 'User modified' })
                      }
                    )
                  } else {
                    connection.query(
                      "UPDATE user SET name='" +
                        req.body.userName.toUpperCase() +
                        "', firstName='" +
                        req.body.userFirstName.charAt(0).toUpperCase() +
                        req.body.userFirstName.slice(1) +
                        "', password='" +
                        hash +
                        "', sector='" +
                        req.body.userSector +
                        "' WHERE userId ='" +
                        req.body.userId +
                        "'",
                      function (err, resp) {
                        if (err) throw err
                        return res
                          .status(200)
                          .json({ message: 'User modified' })
                      }
                    )
                  }
                })
                .catch((error) =>
                  res.status(500).json({ error: 'bcrypt error' })
                )
            }
          })
          .catch((error) =>
            res.status(500).json({ error: 'bcrypt compare error' })
          )
      }
    )
  } else {
    // If no new passsword, no need to check
    if (req.file) {
      const profilePic = req.body.profilePic
      console.log(req.body)
      const filename = profilePic.split('/profilePics/')[1]
      fs.unlink(`images/profilePics/${filename}`, () => {})
      connection.query(
        "UPDATE user SET name='" +
          req.body.userName.toUpperCase() +
          "', firstName='" +
          req.body.userFirstName.charAt(0).toUpperCase() +
          req.body.userFirstName.slice(1) +
          "', profilePic='" +
          `${req.protocol}://${req.get('host')}/images/profilePics/${
            req.file.filename
          }` +
          "', sector='" +
          req.body.userSector +
          "' WHERE userId ='" +
          req.body.userId +
          "'",
        function (err, resp) {
          if (err) throw err
          return res.status(200).json({ message: 'User modified' })
        }
      )
    } else {
      connection.query(
        "UPDATE user SET name='" +
          req.body.userName.toUpperCase() +
          "', firstName='" +
          req.body.userFirstName.charAt(0).toUpperCase() +
          req.body.userFirstName.slice(1) +
          "', sector='" +
          req.body.userSector +
          "' WHERE userId ='" +
          req.body.userId +
          "'",
        function (err, resp) {
          if (err) throw err
          return res.status(200).json({ message: 'User modified' })
        }
      )
    }
  }
}
