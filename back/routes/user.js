const express = require('express')
const router = express.Router()

const multerProfile = require('../middlewares/multer-profilePic')
const userCtrl = require('../controllers/user')

router.post('/login', userCtrl.login)
router.post('/signup', userCtrl.signup)
router.delete('/delete', userCtrl.deleteProfile)
router.put('/update', multerProfile, userCtrl.updateProfile)

module.exports = router
