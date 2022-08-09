const connection = require('../db')

// Function to handle "'" characters by escaping them
function replaceChars(search, replacement, string) {
  return string.split(search).join(replacement)
}

exports.getPosts = (req, res, next) => {
  connection.query(
    'SELECT * FROM post JOIN user ON post.user_id = user.id',
    function (err, resp) {
      if (err) throw err
      return res.status(200).json({ resp })
    }
  )
}

exports.sharePost = (req, res, next) => {
  let postText = replaceChars("'", "\\'", req.body.text)
  connection.query(
    "INSERT INTO post (user_id, text, imageUrl) VALUES ('" +
      req.body.userId +
      "','" +
      postText +
      "','" +
      `${req.protocol}://${req.get('host')}/images/postPics/${
        req.file.filename
      }` +
      "')",
    function (err, resp) {
      if (err) throw err
      return res.status(200).json({ resp })
    }
  )
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
  connection.query(
    "DELETE FROM post WHERE id='" + req.body.id + "'",
    function (err, resp) {
      if (err) throw err
      return res.status(200).json({ resp })
    }
  )
}
