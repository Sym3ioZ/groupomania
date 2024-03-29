const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth')
const multerPost = require('../middlewares/multer-postPic')
const postCtrl = require('../controllers/post')

router.get('/', postCtrl.getPosts)
router.get('/getLikes', postCtrl.getLikes)
router.get('/:id', postCtrl.getPost)
router.post('/post', auth, multerPost, postCtrl.sharePost)
router.put('/updatePost:id', auth, multerPost, postCtrl.updatePost)
router.put('/likePost', auth, postCtrl.likePost)
router.delete('/deletePost:id', auth, postCtrl.deletePost)

module.exports = router
