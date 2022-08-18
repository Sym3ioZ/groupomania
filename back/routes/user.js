const express = require('express')
const router = express.Router()

const multerProfile = require('../middlewares/multer-profilePic')
const userCtrl = require('../controllers/user')

router.get('/getProfile:id', userCtrl.getProfile)
router.post('/login', userCtrl.login)
router.post('/signup', multerProfile, userCtrl.signup)
router.delete('/deleteProfile:id', userCtrl.deleteProfile)
router.put('/updateProfile', multerProfile, userCtrl.updateProfile)

module.exports = router
