const express = require('express');
const router = express.Router();
const pictureController = require('../controllers/pictureController')

router.post('/upload', pictureController.uploadPicture);
router.get('/download/:picture_id', pictureController.downloadPicture)
router.post('/share', pictureController.sharePicture);
router.delete('/unshare/:picture_id', pictureController.unsharePicture);
//router.post('/',userController.login);

module.exports = router;