const multer = require('multer')
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

console.log('multer in')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images/postPics')
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_').split('.')[0] // Splits spaces in filenames and replace them with '_', then keeps only the name before the '.' followed by extension
    const extension = MIME_TYPES[file.mimetype] // Adjusts extension with mimetype declared above
    callback(null, name + '(' + Date.now() + ').' + extension) // Sets the filename
  },
})
console.log(storage)

module.exports = multer({ storage: storage }).single('image')
