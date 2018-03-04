var request = require('request');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var uuid = require('uuid');
var config = require('./config.js');
const dal = require('./dal.js');


router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', function(req, res) {
    res.send('Veuillez choisir une action');
});


router.get('/episodes', function(req, res) {
    dal.getAll().then((episodes) => {
        res.status(201);
        res.send(episodes);
    }).catch(() => {
        res.status(404).end();
    });
});

router.post('/episodes', function(req, res) {
    var id = uuid.v4();
    var episodeToAdd = req.body;
    if(typeof episodeToAdd.name !== "string" || typeof episodeToAdd.code !== "string" || typeof episodeToAdd.score !== "number") {
        res.status(400);
    }
    dal.insert(episodeToAdd, id).then((episode) => {
        episode.id = id;
        res.status(201);
        res.send(episode);
        console.log(episode);
    }).catch(() => {
        res.status(404).end();
    });
});

router.get('/episodes/:id', function (req, res) {
    let id = req.params.id;
    if(id != undefined) {
        dal.getById(id).then((episode) => {
            res.send(episode);
            res.status(201);
        }).catch(() => {
            res.status(404);
        })
    } else {
        res.status(404);
    }
});

router.delete("/episodes/:id", function (req, res) {
    let id = req.params.id;
    if(id != undefined) {
        dal.delete(id).then((episode) => {
            console.log(episode);
            res.send(episode);
            res.status(201);
        }).catch(() => {
            res.status(404);
        })
    } else {
        res.status(404);
    }
});

router.patch("/episodes/:id", function(req, res) {
    var id = req.params.id;
    dal.update(id, req.body).then((episode) => {
        episode.id = id;
        res.send(episode);
        res.status(201);
    }).catch(() => {
        res.status(404);
    })
});

router.get('/series', function(req, res) {
    dal.getAll().then((episodes) => {
        const series = [];
        episodes.forEach((episode) => {
            console.log(episode.name);
            if (!series.includes(episode.name)){
                series.push(episode.name);
            }
        });
        res.status(201);
        res.send(series);
    }).catch(() => {
        res.status(404).end();
    });
});

router.post('/icons', function (req, res) {
    const extensions = ['jpg', 'png', 'jpeg', 'gif'];
    const icon = req.body;

    const url = icon.url;
    const fragments = url.split('.');
    const extension = fragments[fragments.length - 1];

    const name = icon.name.replace(/\s\s+/g, '_').replace(/\s/g, '_').toLowerCase() + "." +extension;

    if (extensions.includes(extension)){
        request.get(url).on('response', function(response) {
            res.status(response.statusCode);
        }).pipe(fs.createWriteStream(config.data + '/icons/' + name));
    }else{
        res.status(500);
        res.send("L'extension du fichier n'est pas supportée");
    }

    res.end();
});

router.get('/icon/:id', function (req, res) {
    const id = req.params.id.replace(/\s\s+/g, '_').replace(/\s/g, '_').toLowerCase();
    const idRegex = new RegExp(id, "g");
    let result = false;
    fs.readdir(config.data + "/icons", (err, files) => {
        files.forEach(function (elt) {
            if (elt.match(idRegex)){
                fs.readFile(config.data + "/icons/" + elt, (err, data) => {
                    if (err) res.status(500).send("Erreur lors de la lecture du fichier");
                    else {
                        const fragments = elt.split('.');
                        let type = fragments[fragments.length - 1];
                        if (type === "jpg") type = 'jpeg';

                        result = true;
                        res.header("Content-type","image/" + type);
                        res.status(200).send(data);
                    }
                });
            }
        });
    });
});



function fetchImage(url, localPath, index) {
    var extensions = ['jpg', 'png', 'jpeg', 'bmp'];

    if (index === extensions.length) {
        console.log('Fetching ' + url + ' failed.');
        return;
    }

    var fullUrl = url + extensions[index];

    request.get(fullUrl, function(response) {
        if (response.statusCode === 200) {
            fs.write(localPath, response.body, function() {
                console.log('Successfully downloaded file ' + url);
            });
        }

        else {
            fetchImage(url, localPath, index + 1);
        }
    });
}

module.exports = router;

