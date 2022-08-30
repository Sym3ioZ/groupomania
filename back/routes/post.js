const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth')
const multerPost = require('../middlewares/multer-postPic')
const postCtrl = require('../controllers/post')

router.get('/', auth, postCtrl.getPosts)
router.get('/getLikes', auth, postCtrl.getLikes)
router.get('/:id', auth, postCtrl.getPost)
router.post('/post', auth, multerPost, postCtrl.sharePost)
router.put('/updatePost:id', auth, multerPost, postCtrl.updatePost)
router.put('/likePost:id', auth, postCtrl.likePost)
router.put('/unlikePost:id', auth, postCtrl.unlikePost)
router.delete('/deletePost:id', auth, postCtrl.deletePost)

module.exports = router
