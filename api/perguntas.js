var express = require('express');
var router = express.Router();
var db = require('../db');


router.post('/', (req, res) => {
    var numero = req.body.id;
    if (db.checkQuestion(numero)) {
        console.log("Já Existe, não é permitido adicionar estudantes com o mesmo numero");
        res.status(400).send("Já Existe, não é permitido adicionar estudantes com o mesmo numero")
    } else {
        console.log("A adicionar");
        db.get('perguntas').push(req.body).write();
        console.log("Adicionado");
        res.status(200).send("Adicionado");
    }
});

router.get('/', (req, res) => {
    res.status(200).json(db.get('perguntas').value());
});

router.get('/:id', (req, res) => {
    numero = req.params.id;
    if (db.checkQuestion(numero)) {
        res.status(200).json(db.get('perguntas').find({ id: numero }).value())
    } else {
        console.log("Não existe nenhuma pergunta com esse numero");
        res.status(400).send("Não existe nenhuma pergunta com esse numero")
    }
});

router.delete('/', (req, res) => {
    db.get('perguntas').remove().write();

    res.status(200).send("Tudo eliminado com sucesso");
});

router.delete('/:id', (req, res) => {
    numero = req.params.id;
    if (db.checkQuestion(numero)) {
        db.get('perguntas').remove({ id: numero }).write()
        res.status(200).send("Eliminado")
    } else {
        console.log("Aluno não encontrado")
        res.status(400).send("Não foi possível eliminar aluno, número inexistente")

    }

});

router.put('/:id', (req, res) => {
    var numero = req.params.id;
    if (db.checkQuestion(numero)) {
        if (db.checkQuestion(req.body.id) & req.body.id != numero) {
            console.log("Já Existe, não é permitido adicionar estudantes com o mesmo numero");
            res.status(400).send("Já Existe")
        } else {
            db.get('perguntas').find({ id: numero }).assign(req.body).write()
            res.status(200).send("correu bem");
        }

    } else {
        console.log("Aluno não encontrado")
        res.status(400).send("Não foi possível alterar aluno, número inexistente")
    }
});

module.exports = router