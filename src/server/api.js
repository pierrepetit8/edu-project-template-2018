
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
    dal.insert(episodeToAdd).then((episode) => {
        res.status(200);
        res.send(episode);
    }).catch(() => {
        res.status(404).end();
    });
});

router.get('/episode/:id', function (req, res) {
    let id = req.params.id;
    console.log(req);
    if(id != undefined) {
        dal.getById(req.params.id).then((episode) => {
            res.send(episode);
            res.status(200);
        }).catch(() => {
            res.status(404);
        })
    }
});

router.delete("/episode", function (req, res) {
    var files = fs.readdirSync("./data");
    var id = req.query.id;
    var episode = {};
    files.forEach(function(elt) {
        var fragments = elt.split('.');
        if(fragments.pop() == 'json' && fragments[0] == id){
            var data = fs.readFileSync('./data/' + elt);
            var parsed = JSON.parse(data);
            episode = {
                id : elt.split('.')[0],
                name : parsed.name,
                code : parsed.code,
                score : parsed.score,
            };

            fs.unlinkSync('./data/' + elt);
        }
    });

    res.send(episode);
});

router.patch("/episode", function(req, res) {
    var files = fs.readdirSync("./data");
    var id = req.query.id;
    var episode = {};
    files.forEach(function(elt) {
        var fragments = elt.split('.');
        if(fragments.pop() == 'json' && fragments[0] == id){
            var data = fs.readFileSync('./data/' + elt);
            var parsed = JSON.parse(data);
            episode = {
                id : elt.split('.')[0],
                name : parsed.name,
                code : parsed.code,
                score : parsed.score,
            };
        }
    });

    if (Object.keys(episode).length == 0){
        res.send(episode);
    }

    if( req.query.name != null){
        episode.name = req.query.name;
    }


    if( req.query.score != null) {
        episode.score = req.query.score;
    }


    if( req.query.code != null) {
        episode.code = req.query.code;
    }

    fs.writeFile("data/"+ episode.id +".json", JSON.stringify({
        name : episode.name,
        code : episode.code,
        score : episode.score
    }));

    res.send(episode);
});


module.exports = router;

