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

exports.getLikes = (req, res, next) => {
  connection.query('SELECT * FROM likes', function (err, resp) {
    if (err) throw err
    return res.status(200).json({ resp })
  })
}

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

exports.sharePost = (req, res, next) => {
  const postText = replaceChars("'", "\\'", req.body.text)
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
  const publishId = req.params.id.replace(/:/g, '')
  const postText = replaceChars("'", "\\'", req.body.text)
  if (req.file) {
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
      return res.status(200).json({ message: 'Post deleted' })
    }
  )
}

exports.likePost = (req, res, next) => {
  connection.query(
    "INSERT INTO likes (post_id, user_id) VALUES ('" +
      req.body.postId +
      "', '" +
      req.body.userId +
      "')",
    function (err, resp) {
      if (err) throw err
      return res.status(200).json({ resp: resp, message: 'post liked !' })
    }
  )
}

exports.unlikePost = (req, res, next) => {
  connection.query(
    "DELETE FROM likes WHERE user_id = '" +
      req.body.userId +
      "' AND post_id = '" +
      req.body.postId +
      "'",
    function (err, resp) {
      if (err) throw err
      return res.status(200).json({ resp: resp, message: 'post unliked !' })
    }
  )
}
