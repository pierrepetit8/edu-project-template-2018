var express = require('express');
var router = express.Router();
var fs = require('fs');
var uuid = require('uuid');

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', function(req, res) {
    res.send('Veuillez choisir une action');
});

router.get('/episodes', function(req, res) {
    res.send('hey');
});

// define the about route
router.post('/episodes', function(req, res) {
    fs.writeFile("data/"+uuid.v4()+".json", JSON.stringify(req.query));
    res.send(req.query);
});

module.exports = router;

