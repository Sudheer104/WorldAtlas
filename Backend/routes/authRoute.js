//Here API are created like for '/mail-verification', '/reset-password'
const express = require('express');

const router = express.Router();

router.use(express.json());

//Body parse -->its is used for get data from form
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));


const userController = require("../controllers/userController");

router.get('/mail-verification',userController.mailVerification);

router.get('/reset-password',userController.resetPassword);
router.post('/reset-password',userController.updatePassword);
router.get('/reset-success',userController.resetSuccess);

module.exports = router;