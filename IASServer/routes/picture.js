const express = require('express');
const router = express.Router();
const pictureController = require('../controllers/pictureController')

router.post('/upload', pictureController.uploadPicture);
router.get('/download/:picture_id', pictureController.downloadPicture);
router.get('/all', pictureController.getAllOwnedPictures);
router.post('/share', pictureController.sharePicture);
router.delete('/unshare/:picture_id', pictureController.unsharePicture);
router.delete('/delete/:picture_id', pictureController.deletePicture);
//router.post('/',userController.login);

module.exports = router;