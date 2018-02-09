
var express = require('express');
var router = express.Router();
var fs = require('fs');
var uuid = require('uuid');
var config = require('./config.js')

function readFile(fileName) {
    return new Promise((resolve, reject) => {
        if(fileName.split('.').pop() == 'json'){
            console.log(fileName);
             fs.readFile(config.data + "/" + fileName, (err, data) => {
                 if(err) reject(err);
                 else {
                     resolve(JSON.parse(data));
                 }
             });
        }
    })

}

module.exports.getAll = function() {
    var files = fs.readdirSync(config.data);
    var episodes = [];
    return new Promise((resolve, reject) => {
        files.forEach(function(elt) {
            readFile(elt).then((parsed) => {
                episodes.push({
                    id : elt.split('.')[0],
                    name : parsed.name,
                    code : parsed.code,
                    score : parsed.score,
                });
                console.log(episodes);
                resolve(episodes);
            }).catch((err) => {
                reject(err);
            });
        });
    }) 
};

module.exports.getById = function(id) {
    var files = fs.readdirSync(config.data);
    var episode;
    return new Promise((resolve, reject) => {
        files.forEach(function(elt) {
            var fragments = elt.split('.');
            if(fragments.pop() == 'json' && fragments[0] == id){
                readFile(elt).then((parsed) => {
                    episode = {
                        id : id,
                        name : parsed.name,
                        code : parsed.code,
                        score : parsed.score,
                    };
                    resolve(episode);
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    });
};

module.exports.insert = function(episode, id) {
    return new Promise((resolve, reject) => {
        fs.writeFile(config.data + "/" + id + ".json", JSON.stringify(episode));
        console.log(episode);
        resolve(episode);
    });
};

module.exports.delete = function(id) {
    return new Promise((resolve, reject) => {
        this.getById(id).then((episode) => {
            fs.unlink(config.data + "/" + id + ".json", (err) => {

                if(err) {
                    reject(err);
                } else {
                    console.log(episode);
                    resolve(episode);
                }
            });
        }).catch((err) => {
            reject(err);
        })
    });
};

module.exports.update = function(id, body) {
    return new Promise((resolve, reject) => {
        this.getById(id).then((episode) => {
            for (var key in body){
                if (episode.hasOwnProperty(key)){
                    console.log(key)
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