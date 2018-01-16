const express = require('express');
const api = require('./api.js');
const config = require('./config.js');


const app = express();
app.use('/api', api);

app.listen(config.port, function () {
    console.log('Example app listening on port 3000!')
});




