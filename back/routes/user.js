const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth')
const multerProfile = require('../middlewares/multer-profilePic')
const userCtrl = require('../controllers/user')

router.get('/getProfile:id', userCtrl.getProfile)
router.post('/login', userCtrl.login)
router.post('/signup', multerProfile, userCtrl.signup)
router.delete('/deleteProfile', auth, userCtrl.deleteProfile)
router.put('/updateProfile', auth, multerProfile, userCtrl.updateProfile)

module.exports = router
