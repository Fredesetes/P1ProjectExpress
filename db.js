var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');

var adapter = new FileSync('./api/db.json');

var db = low(adapter);

db.defaults({ estudantes: [] }, { perguntas: [] }).write();

db.check = function(numero) {
    return db.get('estudantes').find({ id: numero }).value() ? true : false;
}

db.checkQuestion = function(questionId) {
    return db.get('perguntas').find({ id: questionId }).value() ? true : false;
}

module.exports = db;