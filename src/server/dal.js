
var express = require('express');
var router = express.Router();
var fs = require('fs');
var uuid = require('uuid');


function readFile(fileName) {
    return new Promise((resolve, reject) => {
        if(fileName.split('.').pop() == 'json'){
             fs.readFile('./data/' + fileName, (err, data) => {
                 if(err) reject(err);
                 else resolve(JSON.parse(data));
             });
        }
    })

}

function deleteFile(fileName) {
    return new Promise((resolve, reject) => {

    })
}
/**
 * Renvoit tous les episodes
 */
module.exports.getAll = function() {
    var files = fs.readdirSync("./data");
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
                resolve(episodes);
            }).catch((err) => {
                reject(err);
            });
        });
    }) 
};

module.exports.getById = function(id) {
    var files = fs.readdirSync("./data");
    var episode;
    console.log(id);
    return new Promise((resolve, reject) => {
        files.forEach(function(elt) {
            var fragments = elt.split('.');
            if(fragments.pop() == 'json' && fragments[0] == id){
                readFile(elt).then((parsed) => {
                    episode = {
                        id : elt.split('.')[0],
                        name : parsed.name,
                        code : parsed.code,
                        score : parsed.score,
                    };
                });
            }
        });
        if(Object.keys(episode).length === 0) {
            console.log("reject");
            reject(episode);
        }
        console.log("resolve");
        resolve(episode);
    });
};

module.exports.insert = function(episode) {
    var id = uuid.v4();
    return new Promise((resolve, reject) => {
        fs.writeFile("data/"+id+".json", JSON.stringify(episode));
        resolve(episode);
    });
};

//TODO faire marcher avec le getById interne à la DAL
module.exports.delete = function(id) {
    var files = fs.readdirSync("./data");
    var episode = {};
    return new Promise((resolve, reject) => {
        this.getById(id).then((episode) => {
            fs.unlink('./data/' + id + ".json", (err) => {

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
        resolve(episode);
    })
};