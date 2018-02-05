
var express = require('express');
var router = express.Router();
var fs = require('fs');
var uuid = require('uuid');

// TODO promise 
function readFile(fileName) {
    if(fileName.split('.').pop() == 'json'){
        var data = fs.readFileSync('./data/' + fileName)
        return JSON.parse(data);
    }
}

/**
 * Renvoit tous les episodes
 */
module.exports.getAll = function() {
    var files = fs.readdirSync("./data");
    var episodes = [];
    return new Promise((resolve, reject) => {
        files.forEach(function(elt) {
                var parsed  = readFile(elt);
                console.log(parsed);
                episodes.push({
                    id : elt.split('.')[0],
                    name : parsed.name,
                    code : parsed.code,
                    score : parsed.score,
                });
        });
        resolve(episodes);
    }) 
}

module.exports.getById = function(id) {
    var files = fs.readdirSync("./data");
    return new Promise((resolve, reject) => {
        files.forEach(function(elt) {
            var fragments = elt.split('.');
            if(fragments.pop() == 'json' && fragments[0] == id){
                var parsed = readFile(elt);
                episode = {
                    id : elt.split('.')[0],
                    name : parsed.name,
                    code : parsed.code,
                    score : parsed.score,
                };
            }
        });
        if(Object.keys(episode).length === 0) {
            reject(episode);
        }
        resolve(episode);
    })
}

module.exports.insert = function(episode) {
    var id = uuid.v4();
    return new Promise((resolve, reject) => {
        fs.writeFile("data/"+id+".json", JSON.stringify(episode));
        resolve(episode);
    });
}
//TODO faire marcher avec le getById interne à la DAL
module.exports.delete = function(id) {
    var files = fs.readdirSync("./data");
    var episode = {};
    return new Promise((resolve, reject) => {
        getById(id).then((episode) => {
            fs.unlinkSync('./data/' + elt, (err) => {
                if(error) {
                    reject(new Error('Probleme de unlink fichier'));
                } else {
                    console.log(episode);
                    resolve(episode);
                }
            });
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports.update = function(episode) {

    return new Promise((resolve, reject) => {
        fs.writeFile("data/"+ episode.id +".json", JSON.stringify({
            name : episode.name,
            code : episode.code,
            score : episode.score
        }), (err) => {
            if(err) {
                reject(episode);
            } else {
                resolve(episode);
            }
        });
    })
}