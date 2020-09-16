if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
var express = require('express');
var bodyParser = require('body-parser');
var estudantes = require('./api/estudantes.js');
var perguntas = require('./api/perguntas.js')
var login = require('./api/login.js');
var path = require('path');
var passport = require('passport')
const flash = require('express-flash')
var session = require('express-session')
const db = require('./db.js');


const initializePassport = require('./api/passport_config');
initializePassport(passport,
    id => db.get('estudantes').find({ id: id }).value()
)

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//passport
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


//routes
app.use('/api/estudantes', estudantes);

app.use('/api/perguntas', perguntas);

//app.use('/api/login', login);


app.use(express.static(path.join(__dirname, '/html')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/api/login', passport.authenticate('local', {
    successRedirect: '/logged/profile',
    failureRedirect: '/',
    failureFlash: true
}))

app.use('/', (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status = 404;
    next(error)
})

app.use('/', (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status = statusCode
    console.log(error.message);
})

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
})