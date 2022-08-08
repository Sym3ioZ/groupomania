const express = require('express')
const router = express.Router()

// const auth = require('../middlewares/auth')
const multerPost = require('../middlewares/multer-postPic')
const postCtrl = require('../controllers/post')

router.get('/', postCtrl.getPosts)
router.post('/post', multerPost, postCtrl.sharePost)
router.put('/update', postCtrl.updatePost)
router.delete('/delete', postCtrl.deletePost)

module.exports = router
