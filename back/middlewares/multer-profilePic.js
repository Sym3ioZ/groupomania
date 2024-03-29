const multer = require('multer')
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
}

const storage = multer.diskStorage({
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  destination: (req, file, callback) => {
    callback(null, 'images/profilePics')
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_').split('.')[0] // Splits spaces in filename and replace them with '_', then keeps only the name before the '.' followed by extension
    const extension = MIME_TYPES[file.mimetype] // Adjusts extension with mimetype declared above
    callback(null, name + '(' + Date.now() + ').' + extension) // Sets the filename
  },
})

module.exports = multer({ storage: storage }).single('image')
