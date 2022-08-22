const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1] // Retrieves token from headers
    const decodedToken = jwt.verify(token, process.env.TOKEN_STRING) // Decodes token
    const userId = decodedToken.userId // Retrieves userId from the token object
    if (req.body.userId && +req.body.userId !== +userId) {
      // Compares userId with the one in the token
      return res
        .status(403)
        .json({ code: '403', error: 'Unauthorized request' })
    } else {
      next() // Else go to next module
    }
  } catch {
    res.status(401).json({ code: '401', error: 'Invalid request !' })
  }
}
