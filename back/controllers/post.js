const connection = require('../db')
const fs = require('fs')

// Function to handle "'" characters by escaping them
function replaceChars(search, replacement, string) {
  return string.split(search).join(replacement)
}

// Selecting every post and returning them
exports.getPosts = (req, res, next) => {
  connection.query(
    'SELECT * FROM post JOIN user ON post.user_id = user.userId ORDER BY createDate DESC',
    function (err, resp) {
      if (err) throw err
      return res.status(200).json({ resp })
    }
  )
}

// Sekecting every likes and returning them
exports.getLikes = (req, res, next) => {
  connection.query('SELECT * FROM likes', function (err, resp) {
    if (err) throw err
    return res.status(200).json({ resp })
  })
}

// Selecting 1 post with sent id and returning it
exports.getPost = (req, res, next) => {
  const params = req.params.id.replace(/:/g, '')
  connection.query(
    "SELECT * FROM post WHERE id = '" + params + "'",
    function (err, resp) {
      if (err) throw err
      return res.status(200).json({ resp })
    }
  )
}

// Inserting data into a new entry in post table
exports.sharePost = (req, res, next) => {
  const postText = replaceChars("'", "\\'", req.body.text)
  if (req.file) {
    // If a file is present, adding it to the entry
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

// Updating an existing post
exports.updatePost = (req, res, next) => {
  const publishId = req.params.id.replace(/:/g, '')
  const postText = replaceChars("'", "\\'", req.body.text)
  if (req.file) {
    // If a file is present, deleting the old one before adding the new one
    const imageUrl = req.body.imageUrl
    const filename = imageUrl.split('/postPics/')[1]
    fs.unlink(`images/postPics/${filename}`, () => {})
    connection.query(
      "UPDATE post SET text='" +
        postText +
        "', imageUrl='" +
        `${req.protocol}://${req.get('host')}/images/postPics/${
          req.file.filename
        }` +
        "', modified='1'" +
        " WHERE id ='" +
        publishId +
        "'",
      function (err, resp) {
        if (err) throw err
        return res.status(200).json({ message: 'Post modified' })
      }
    )
  } else {
    connection.query(
      "UPDATE post SET text='" +
        postText +
        "', modified='1'" +
        " WHERE id ='" +
        publishId +
        "'",
      function (err, resp) {
        if (err) throw err
        return res.status(200).json({ message: 'Post modified' })
      }
    )
  }
}

// Deleting a post entry with the sent id
exports.deletePost = (req, res, next) => {
  const params = req.params.id.replace(/:/g, '')
  if (req.body.imageUrl) {
    // If an image was associated to that post, deleting it
    const imageUrl = req.body.imageUrl
    const filename = imageUrl.split('/postPics/')[1]
    fs.unlink(`images/postPics/${filename}`, () => {})
  }
  connection.query(
    // Also deleting likes associated to that post
    "DELETE FROM likes WHERE post_id='" + params + "'",
    function (err, resp) {
      if (err) throw err
      connection.query(
        // Deleting post
        "DELETE FROM post WHERE id='" + params + "'",
        function (err, resp) {
          if (err) throw err
        }
      )
      return res.status(200).json({ message: 'Post deleted' })
    }
  )
}

// Adding or removing a like from likes table
exports.likePost = (req, res, next) => {
  let checkUser = false
  connection.query(
    // Checjing if user has already liked the post
    "SELECT * FROM likes WHERE post_id = '" + req.body.postId + "'",
    function (err, resp) {
      if (resp.length > 0) {
        for (let i = 0; i < resp.length; i++) {
          if (+resp[i].user_id === +req.body.userId) {
            checkUser = true
          }
        }
      }

      if (checkUser === true) {
        // If user already liked the post, deleting the entry (as unlike)
        connection.query(
          "DELETE FROM likes WHERE user_id = '" +
            req.body.userId +
            "' AND post_id = '" +
            req.body.postId +
            "'",
          function (err, resp) {
            if (err) throw err
            return res.status(200).json({ message: 'post unliked !' })
          }
        )
      } else {
        connection.query(
          "INSERT INTO likes (post_id, user_id) VALUES ('" +
            req.body.postId +
            "', '" +
            req.body.userId +
            "')",
          function (err, resp) {
            if (err) throw err
            return res.status(200).json({ message: 'post liked !' })
          }
        )
      }
    }
  )
}
