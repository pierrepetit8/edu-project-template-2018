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
    var files = fs.readdirSync("./data");
    var episodes = [];

    files.forEach((elt) => {
        if(elt.split('.').pop() == 'json'){
            var data = fs.readFileSync('./data/' + elt);
            var parsed = JSON.parse(data);
            episodes.push({
                id : elt.split('.')[0],
                name : parsed.name,
                code : parsed.code,
                score : parsed.score,
            });
        }
    });

    res.send(episodes);
});

// define the about route
router.post('/episodes/add', function(req, res) {
    var id = uuid.v4();
    var episode = req.query;
    fs.writeFile("data/"+id+".json", JSON.stringify(episode));
    res.send({
        id : id,
        name : episode.name,
        code : episode.code,
        score : episode.score
    });
});

router.get("/episode", function (req, res) {
    var files = fs.readdirSync("./data");
    var id = req.query.id;
    var episode = {};
    files.forEach((elt) => {
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

    res.send(episode);
});

router.delete("/episode", function (req, res) {
    var files = fs.readdirSync("./data");
    var id = req.query.id;
    var episode = {};
    files.forEach((elt) => {
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
    files.forEach((elt) => {
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

