const express = require('express');

const router = express.router();

router.get('/signup',(re,res)=>{
    return res.render("signup");
})

module.exports = router;