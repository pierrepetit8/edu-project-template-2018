const express = require('express');
const api = require('./api.js');
const config = require('./config.js');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use('/api', api);




app.listen(config.port, function () {
    console.log('Example app listening on port 3000!')
});





