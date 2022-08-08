const connection = require('../db')

exports.getPosts = (req, res, next) => {
  connection.query('SELECT * FROM post', function (err, resp) {
    if (err) throw err
    return res.status(200).json({ resp })
  })
}

exports.sharePost = (req, res, next) => {
  console.log(req.body)
  console.log("sharepost")

  connection.query(
    "INSERT INTO post (user_id, text, imageUrl) VALUES ('" +
      req.body.userId +
      "','" +
      req.body.text +
      "','" +
      `${req.protocol}://${req.get('host')}/images/postPics/${req.file.filename}` +
      "')",
    function (err, resp) {
      if (err) throw err
      return res.status(200).json({ resp })
    }
  )
}

exports.updatePost = (req,res,next) => {
  connection.query("UPDATE post SET text='" + req.body.text + "' WHERE id ='" + req.body.id + "'", function (err, resp) {
    if (err) throw err
    return res.status(200).json({ resp })
  })
}

exports.deletePost = (req, res, next) => {
  connection.query("DELETE FROM post WHERE id='" + req.body.id + "'", function (err, resp) {
    if (err) throw err
    return res.status(200).json({ resp })
  })
}