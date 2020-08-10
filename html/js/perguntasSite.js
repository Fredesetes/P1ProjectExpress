$(function() {
    let showQuestions = $("#showQuestions")
    let tabelaResp = $("#tabelaRespostas tbody");
    let collapse = ($(".collapseRespostas"));
    let modalChange = ($("#changeModal"));



    $.get('http://localhost:3000/api/perguntas', function(data) {
        data.forEach((pergunta) => {
            adicionarQuestao(pergunta);
        });
    });

    $('#newAnswer').click(function() {
        if ($(".answer").length < 4) {
            let input = "<td><input class='answer' type='text'></td>"
            tabelaResp.append("<tr>" + input + "</tr>")
        } else {
            console.log("mais nada")
        }

        console.log($(".answer").length)
    })

    //Mostrar respostas
    /*tabela.on("click", ".answers", function() {
        let id = $(this).attr("answerNr");
        let perguntas = $(this).attr("answers")
        console.log(perguntas)
        console.log(id)

    })*/

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
            $.notify("Impossível adicionar aluno", "warn");
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
            $("#questionNumber").val("");
            $("#questionDescription").val("");
        }
    });

    showQuestions.on("click", ".answers", function() {
        let col = $(this).closest(".collapseAnswer")
        let respostas = $(this).attr("answers")

        console.log(respostas)
        collapse.collapse('toggle')
    })

    showQuestions.on("click", ".del", function() {
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

    /*showQuestions.on("click", ".change", function() {

        let thisRow = $(this).closest("tr");
        presentRow = thisRow
        priorId = $(thisRow.find("td")[0]).text()

        modalChange.find(".questionNumber").val($(thisRow.find("td")[0]).text())
        modalChange.find(".questionDescription").val($(thisRow.find("td")[1]).text())
        modalChange.modal()
    })*/

    function adicionarQuestao(pergunta) {
        let colId = "<div class='col-sm'><p>" + pergunta.id + "</p></div>";
        let colDescricao = "<div class='col-sm'><p>" + pergunta.descricao + "</p></div>";
        console.log(pergunta);

        let tdOptionDelete = "<div class='col-sm'><button type='button' questionNr='" + pergunta.id + "' class='btn btn-sm btn-danger del'>Delete</button></div>";
        let tdOptionChange = "<div class='col-sm'><button type='button' data-target='#changeModal' questionNr='" + pergunta.id + "' class='btn btn-sm btn-warning change'>Change</button></div>";
        let tdOptionRespostas = "<div class='col-sm collapseAnswer'><button type='button' data-toggle='collapse' data-target='#collapseRespostas' answerNr='" + pergunta.id + "' answers = '" + pergunta.respostas + "' class='btn btn-sm btn-primary answers'>Respostas</button></div>";

        showQuestions.append("<div class='row pergunta'>" + colId + colDescricao + "<div class='col-sm'><div class='row'>" + tdOptionRespostas + tdOptionChange + tdOptionDelete + "</div></div></div>");
    };

    /*function escreverResposta() {
        let input = "<td><input class='answer' type='text'></td>"
            //let submitAnswer = "<td><button type='button' class='btn btn-sm btn-primary '>Submit</button></td>"
        tabelaResp.append("<tr>" + input + "</tr>")
    }*/
})