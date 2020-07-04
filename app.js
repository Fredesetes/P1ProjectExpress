var express = require('express');
var bodyParser = require('body-parser');
var estudantes = require('./api/estudantes.js');
var path = require('path');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/estudantes', estudantes);

app.use(express.static(path.join(__dirname, '/html')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
})