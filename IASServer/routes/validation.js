const express = require('express');
const router = express.Router();
const validationController = require('../controllers/validationController')

router.post('/',validationController.validateReCaptcha);

module.exports = router;