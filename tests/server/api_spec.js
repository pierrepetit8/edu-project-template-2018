const fs = require('fs');
const frisby = require('frisby');
const path = require('path');
const Joi = frisby.Joi;
const dal = require('../../src/server/dal');


const URLList = `http://localhost:${process.env.SERVER_PORT}/api/episodes`;
const URL = `http://localhost:${process.env.SERVER_PORT}/api/episode`;
const DATA_DIR = process.env.DATA;

function createFakeEpisode(done) {
  Promise.all([
    dal.insert(
      {name: "Breaking Bad", code: "S01E01", score: 8}, 
      "1111-2222"
    ),
    dal.insert(
      {name: "Lethal Weapon", code: "S01E01", score: 7}, 
      "1111-3333"
    )
  ]).then(() => {
      return;
  });
}

function deleteFakeEpisode(done) {
  fs.readdir(DATA_DIR, (err, files) => {
    if (err) {
      done();
      throw err
    }
    for (const file of files) {
      fs.unlink(path.join(DATA_DIR, file), err => {
        if (err) {
          done();
          throw err
        }
      });
      done();
    }
  });
}

function checkFileExistence(path, done){
  fs.access(path, fs.constants.F_OK, (err) => {
    if(err) fail();
    done();
  });
}

describe('Add an episode', () => {
  let id;
  it('should make an http request', (done) => {
    frisby.post(`${URLList}`, {
        name: "Blindspot",
        code: "S03E02",
        score: 5
      })
      .expect('status', 201)
      .expect('jsonTypes', {
        'id': Joi.string().required(),
        'name': Joi.string().required(),
        'code': Joi.string().required(),
        'score': Joi.number().required()
      }).then((res) => {
        id = res.body.id;
      })
      .done(done);
  });

  it ('should have file in data', (done) => {
    checkFileExistence(path.join(DATA_DIR, `${id}.json`), done);
  });
});

describe('Update an episode', () => {
  let id;
  it('should make an http request', (done) => {
    createFakeEpisode()
    frisby.patch(`${URL}/1111-3333`, {
      name: "Change",
      code: "S03E02",
      score: 5
    })
    .expect('status', 200)
    .expect('jsonTypes', {
      'id': Joi.string().required(),
      'name': Joi.string().required(),
      'code': Joi.string().required(),
      'score': Joi.number().required()
    }).then((res) => {
      id = res.body.id;
    })
    .done(done);  
  });

  it ('should have file in data', (done) => {
      checkFileExistence(path.join(DATA_DIR, `${id}.json`), done);
  });
});

describe('Delete an episode', () => {
  let id;
  it('should make an http request', (done) => {
    createFakeEpisode()
    frisby.del(`${URL}/1111-3333`)
    .expect('status', 200)
    .expect('jsonTypes', {
      'id': '1111-3333',
      'name': 'Lethal Weapon',
      'code': 'S01E01',
      'score': 7
    }).then((res) => {
      id = res.body.id;
    })
    .done(done);  
  });

  it ('should\'t have file in data', (done) => {
      fs.stat(path.join(DATA_DIR, `${id}.json`), (err, stats) => {
        if(err) {
          done();
        } else fail();
      });
  });
});

describe('Get an episode', () => {
  let id;
  it('should make an http request', (done) => {
    createFakeEpisode()
    frisby.get(`${URL}/1111-3333`)
    .expect('status', 200)
    .expect('jsonTypes', {
      'id': Joi.string().required(),
      'name': Joi.string().required(),
      'code': Joi.string().required(),
      'score': Joi.number().required()
    }).then((res) => {
      id = res.body.id;
    })
    .done(done);  
  });

  it ('should have file in data', (done) => {
    fs.stat(path.join(DATA_DIR, `${id}.json`), (err, stats) => {
      if (err  || !stats.isFile()) {
        fail();
      }
      done();
    });
  });
});


