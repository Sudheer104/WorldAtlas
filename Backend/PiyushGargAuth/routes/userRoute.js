const express = require('express');
const {handleUserSignup} = require("../controller/userControllerr");
const router = express.router();

router.post('/',handleUserSignup)

module.exports = router;
