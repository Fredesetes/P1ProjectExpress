$(function() {
    let tabelaPerguntas = $("#tabelaPerguntas")
    let tabelaResp = $("#tabelaRespostas tbody");
    let collapse = ($(".collapseRespostas"));
    let modalChange = ($("#modalChange"));
    let changeAnswers = ($("#modalChange .answers"))
    let count = 0;
    let presentRow;
    let priorId;
    let len;


    //Vai buscar todas as perguntas da base de dados
    $.get('http://localhost:3000/api/perguntas', function(data) {
        data.forEach((pergunta) => {
            adicionarQuestao(pergunta);
        });
    });

    //Botão para adicionar uma resposta
    $('#newAnswer').click(function() {
        event.preventDefault()
        if ($(".answer").length < 4) {
            let input = "<td><input class='answer' type='text'></td>"
            tabelaResp.append("<tr>" + input + "</tr>")
        } else {
            $.notify("Impossível adicionar mais respostas", "warning")
        }
    })



    //Adicionar pergunta e reposta
    $('#button').click(function() {
        let elements = $(".answer")
        let resp = []
        elements.each((i, element) => {
            resp.push({
                id: i + 1,
                descricao: element.value
            })
        })
        if ($("#questioNumber").val() == "" || $("#questionDescription").val() == "") {
            $.notify("Impossível adicionar pergunta", "warn");
        } else {
            let pergunta = {
                id: $("#questionNumber").val(),
                descricao: $("#questionDescription").val(),
                respostas: resp
            };
            $.post('http://localhost:3000/api/perguntas', pergunta, function(data) {
                    $.notify(data, "success");
                    adicionarQuestao(pergunta);
                })
                .fail(function() {
                    $.notify("Impossível adicionar pergunta", "warn")
                })
            $("#questionNumber").val("");
            $("#questionDescription").val("");
        }
    });

    //Apresentar menu de alteração de Perguntas e respostas
    tabelaPerguntas.on("click", ".change", function() {
        $(changeAnswers).html("")
        let id = $(this).attr("questionNr");
        priorId = id;
        let thisRow = $(this).closest("tr");
        presentRow = thisRow;
        let length = $(this).attr("length");
        len = length

        modalChange.find(".questionNumber").val($(thisRow.find("td")[0]).text())
        modalChange.find(".questionDescription").val($(thisRow.find("td")[1]).text())
        for (let index = 0; index < length; index++) {
            $(changeAnswers).append(`<input type="text" class="form-control answerChange">`)
            $(changeAnswers).find('.answerChange').val($(`#tabelaPerguntas .test`).find(`.resposta${index}`).attr('descricao'))
        }

        modalChange.modal()


    })

    //Botão Adiciona Respostas no Modal
    $('.newAnswerChange').click(function() {
        if (len < 4) {
            let input = `<input type="text" class="form-control answerChange">`
            changeAnswers.append(input)
            len++
        } else {
            $.notify("Impossível adicionar mais respostas", "warning")
        }
    })

    //Butao Guarda Alterações
    $('.saveChanges').click(function() {
        let elements = $(".answerChange")
        let resp = []
        elements.each((i, element) => {
            resp.push({
                id: i + 1,
                descricao: element.value
            })
        })
        let pergunta = {
            descricao: modalChange.find(".questionDescription").val(),
            id: modalChange.find('.questionNumber').val(),
            respostas: resp,

        }
        $.ajax({
            url: 'http://localhost:3000/api/perguntas/' + priorId,
            type: "PUT",
            data: pergunta,
            success: function(result) {
                $.notify("Pergunta alterada com sucesso", "success")
                presentRow.remove();
                adicionarQuestao(pergunta);
            }
        })
        modalChange.modal('hide')
    })


    //Elimina uma pergunta
    tabelaPerguntas.on("click", ".del", function() {
        let rowRemove = $(this).closest(".pergunta");
        let id = $(this).attr("questionNr");

        $.ajax({
            url: 'http://localhost:3000/api/perguntas/' + id,
            type: "DELETE",
            success: function(result) {
                $.notify(result, "success");
                rowRemove.remove();
            }
        });
    });

    //Adiciona uma pergunta à tabela 
    function adicionarQuestao(pergunta) {
        count = count + 1
        let tdId = "<td>" + pergunta.id + "</td>";
        let tdDescricao = "<td>" + pergunta.descricao + "</td>";

        let tdOptionDelete = "<button type='button' questionNr='" + pergunta.id + "' class='btn btn-sm btn-danger del'>Delete</button></td>";
        let tdOptionChange = `<button length=${typeof pergunta.respostas=== "undefined" ? 0 : pergunta.respostas.length} type='button' data-target='#changeModal' questionNr='${pergunta.id}' class='btn btn-sm btn-warning change'>Change</button>`;

        let tdOptionRespostas = `<td><button type='button' class='btn btn-sm btn-success answers' data-target='.collapseAnswers${count}' data-toggle='collapse'>Respostas</button>`;



        let tdRespostas;
        if (typeof pergunta.respostas === "undefined") {
            tdRespostas = "<td colspan='3'>Não existem respostas para esta pergunta</td>"
        } else {
            tdRespostas = "<td colspan='3'>";
            for (let index = 0; index < pergunta.respostas.length; index++) {
                tdRespostas += `<p class='resposta${index}' number='${pergunta.respostas[index].id}' descricao='${pergunta.respostas[index].descricao}'>${pergunta.respostas[index].id}: ${pergunta.respostas[index].descricao} </p>`

            }
            tdRespostas += "</td>"

        }
        let collapse = "<tr class='collapse test collapseAnswers" + count + "'>" + tdRespostas + "</tr>"

        tabelaPerguntas.append("<tr class='pergunta'>" + tdId + tdDescricao + " <div class='btn-group' role='group'>" + tdOptionRespostas + tdOptionChange + tdOptionDelete + "</div></tr>" + collapse);
    };

})