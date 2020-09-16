var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', (req, res) => {
    res.json({
        message: "Got"
    })
})

module.exports = router