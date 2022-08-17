const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth')
const multerPost = require('../middlewares/multer-postPic')
const postCtrl = require('../controllers/post')

router.get('/', auth, postCtrl.getPosts)
router.post('/post', auth, multerPost, postCtrl.sharePost)
router.put('/update', auth, postCtrl.updatePost)
router.delete('/deletePost:id', auth, postCtrl.deletePost)

module.exports = router
