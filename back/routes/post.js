const express = require('express')
const router = express.Router()

const postCtrl = require('../controllers/post')

router.get('/', postCtrl.getPosts);
router.post('/post', postCtrl.post);
// router.post('/modify', postCtrl.modify);
// router.post('/delete', postCtrl.delete);

module.exports = router
