const connection = require('../db')

exports.getPosts = (req,res,next) => {
  connection.query("SELECT * FROM post", function (err, resp) {
      return res.status(200).json({ resp })
  })
}

exports.post = (req,res,next) => {
  connection.query("INSERT INTO post (user_id, text) VALUES ('" + req.body.userId + "','" + req.body.text + "')", function (err,resp) {
    return res.status(200).json({ resp })
  })
}