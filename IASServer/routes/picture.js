const express = require('express');
const router = express.Router();
const pictureController = require('../controllers/pictureController')

router.get('/', pictureController.getAllOwnedPictures);
router.post('/', pictureController.uploadPicture);
router.put('/:picture_id', pictureController.modifyPicture);
router.get('/:picture_id', pictureController.downloadPicture);
router.delete('/delete/:picture_id', pictureController.deletePicture);
//router.post('/',userController.login);

module.exports = router;