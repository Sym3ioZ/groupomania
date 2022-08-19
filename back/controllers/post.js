const connection = require('../db')
const fs = require('fs')

// Function to handle "'" characters by escaping them
function replaceChars(search, replacement, string) {
  return string.split(search).join(replacement)
}

exports.getPosts = (req, res, next) => {
  connection.query(
    'SELECT * FROM post JOIN user ON post.user_id = user.userId ORDER BY createDate DESC',
    function (err, resp) {
      if (err) throw err
      return res.status(200).json({ resp })
    }
  )
}

exports.sharePost = (req, res, next) => {
  console.log(req.body)
  let postText = replaceChars("'", "\\'", req.body.text)
  if (req.file) {
    connection.query(
      "INSERT INTO post (user_id, text, imageUrl, createDate) VALUES ('" +
        req.body.userId +
        "','" +
        postText +
        "','" +
        `${req.protocol}://${req.get('host')}/images/postPics/${
          req.file.filename
        }` +
        "','" +
        req.body.createDate +
        "')",
      function (err, resp) {
        if (err) throw err
        return res.status(200).json({ resp })
      }
    )
  } else {
    connection.query(
      "INSERT INTO post (user_id, text, createDate) VALUES ('" +
        req.body.userId +
        "','" +
        postText +
        "','" +
        req.body.createDate +
        "')",
      function (err, resp) {
        if (err) throw err
        return res.status(200).json({ resp })
      }
    )
  }
}

exports.updatePost = (req, res, next) => {
  connection.query(
    "UPDATE post SET text='" +
      req.body.text +
      "' WHERE id ='" +
      req.body.id +
      "'",
    function (err, resp) {
      if (err) throw err
      return res.status(200).json({ resp })
    }
  )
}

exports.deletePost = (req, res, next) => {
  const params = req.params.id.replace(/:/g, '')
  if (req.body.imageUrl) {
    const imageUrl = req.body.imageUrl
    const filename = imageUrl.split('/postPics/')[1]
    fs.unlink(`images/postPics/${filename}`, () => {})
  }
  connection.query(
    "DELETE FROM post WHERE id='" + params + "'",
    function (err, resp) {
      if (err) throw err
      return res.status(200).json({ resp })
    }
  )
}
