var express = require('express');
var router = express.Router();
var fs = require('fs');
var uuid = require('uuid');
var config = require('./config.js');
const dal = require('./dal.js');

function readFile(fileName) {
    return new Promise((resolve, reject) => {
        if (fileName.split('.').pop() == 'json') {
            fs.readFile(config.data + "/" + fileName, (err, data) => {
                if (err) reject(err);
                else {
                    resolve(JSON.parse(data));
                }
            });
        }
    })
}

module.exports.getAll = function () {
    return new Promise((resolve, reject) => {
        fs.readdir(config.data, (err, files) => {
            var promises = [];


            files.forEach(function (elt) {
                var fragments = elt.split('.');
                promises.push(dal.getById(fragments[0]));
            });

            Promise.all(promises).then((episodes) => {
                resolve(episodes);
            }).catch((err) => {
                reject(err);
            });
        })
    });

};

module.exports.getById = function (id) {
    var episode;
    return new Promise((resolve, reject) => {
        fs.readdir(config.data, (err, files) => {
            files.forEach(function (elt) {
                var fragments = elt.split('.');
                if (fragments.pop() == 'json' && fragments[0] == id) {
                    readFile(elt).then((parsed) => {
                        episode = {
                            id: id,
                            name: parsed.name,
                            code: parsed.code,
                            score: parsed.score,
                        };
                        resolve(episode);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
        })

    });
};

module.exports.insert = function (episode, id) {
    return new Promise((resolve, reject) => {
        fs.writeFile(config.data + "/" + id + ".json", JSON.stringify(episode));
        resolve(episode);
    });
};

module.exports.delete = function (id) {
    return new Promise((resolve, reject) => {
        this.getById(id).then((episode) => {
            fs.unlink(config.data + "/" + id + ".json", (err) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(episode);
                }
            });
        }).catch((err) => {
            reject(err);
        })
    });
};

module.exports.update = function (id, body) {
    console.log('fkfkdsfsdlkfdslfdkslf');
    return new Promise((resolve, reject) => {
        this.getById(id).then((episode) => {
            for (var key in body) {
                if (episode.hasOwnProperty(key)) {
                    episode[key] = body[key];
                }
            }
            delete episode.id;
            this.insert(episode, id).then(resolve(episode));
        }).catch((err) => {
            reject(err);
        });
    })
};