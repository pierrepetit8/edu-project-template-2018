
var express = require('express');
var router = express.Router();
var fs = require('fs');
var uuid = require('uuid');
const dal = require('./dal.js')


router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', function(req, res) {
    res.send('Veuillez choisir une action');
});


router.get('/episodes', function(req, res) {
    dal.getAll().then((episodes) => {
        res.status(200);
        res.send(episodes);
    }).catch(() => {
        res.status(404).end();
    });
});

// define the about route
router.post('/episodes/add', function(req, res) {
    var id = uuid.v4();
    var episodeToAdd = req.body;
    if(typeof episodeToAdd.name !== "string" || typeof episodeToAdd.code !== "string" || typeof episodeToAdd.score !== "number") {
        res.status(400);
    }
    dal.insert(episodeToAdd, id).then((episode) => {
        episode.id = id;
        res.status(201);
        res.send(episode);
    }).catch(() => {
        res.status(404).end();
    });
});

router.get('/episode/:id', function (req, res) {
    let id = req.params.id;
    console.log(req);
    if(id != undefined) {
        dal.getById(id).then((episode) => {
            res.send(episode);
            res.status(200);
        }).catch(() => {
            res.status(404);
        })
    } else {
        res.status(404);
    }
});

router.delete("/episode/:id", function (req, res) {
    let id = req.params.id;
    if(id != undefined) {
        dal.delete(id).then((episode) => {
            console.log(episode);
            res.send(episode);
            res.status(200);
        }).catch(() => {
            res.status(404);
        })
    } else {
        res.status(404);
    }
});

router.patch("/episode/:id", function(req, res) {
    var id = req.params.id;
    dal.update(id, req.body).then((episode) => {
        console.log(episode);
        res.send(episode);
        res.status(200);
    }).catch(() => {
        res.status(404);
    })
});


module.exports = router;

