$(function() {
    //Guarda a Tabela numa variável para depois adicionar os estudantes.
    let tabela = $("#tabelaEstudantes tbody");
    let modal = $("#myModal");
    let priorId;
    let presentRow;

    //GET: Recebe todos os estudantes da base de dados.
    $.get('http://localhost:3000/api/estudantes', function(data) {
        data.forEach((estudante) => {
            adicionarEstudante(estudante);
        });
    });

    //Adiciona um Estudante
    $('#button').click(function() {
        if ($("#studentName").val() == "" || $("#studentNumber").val() == "" || $("#studentType").val() == "" || $("#studentRegime").val() == "" || $("#studentTurn").val() == "") {
            $.notify("Impossível adicionar aluno", "warn");
        } else {
            let estudante = {
                name: $("#studentName").val(),
                id: $("#studentNumber").val(),
                type: $("#studentType").val(),
                regime: $("#studentRegime").val(),
                turn: $("#studentTurn").val()
            };
            console.log(estudante)
            $.post('http://localhost:3000/api/estudantes', estudante, function(data) {
                $.notify(data, "success");
                adicionarEstudante(estudante);
            })
            $("#studentName").val("")
            $("#studentNumber").val("")
            $("#studentType").val("")
            $("#studentRegime").val("")
            $("#studentTurn").val("")
        }
    });

    //Funcionalidade para utilizar o ENTER para adicionar o estudante.
    $('#studentTurn').keyup(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $('#button').click();
        }

    })

    //Remove UM Estudante
    tabela.on("click", ".del", function() {
        let rowRemove = $(this).closest("tr");
        let id = $(this).attr("studentNr");

        $.ajax({
            url: 'http://localhost:3000/api/estudantes/' + id,
            type: "DELETE",
            success: function(result) {
                $.notify(result, "success");
                rowRemove.remove();
            }
        });
    });

    tabela.on("click", ".change", function() {

        let thisRow = $(this).closest("tr");
        presentRow = thisRow
        priorId = $(thisRow.find("td")[0]).text()

        modal.find(".studentNumber").val($(thisRow.find("td")[0]).text())
        modal.find(".studentName").val($(thisRow.find("td")[1]).text())
        modal.find(".studentType").val(inversoType($(thisRow.find("td")[2]).text()))
        modal.find(".studentRegime").val(inversoRegime($(thisRow.find('td')[3]).text()))
        modal.find(".studentTurn").val($(thisRow.find("td")[4]).text())

        modal.modal()
    })

    $("#changeBtn").click(function() {

        if (modal.find(".studentNumber").val() == "") {
            $.notify("Impossível adicionar aluno", "warn");
        } else {
            let estudante = {
                name: modal.find(".studentName").val(),
                id: modal.find(".studentNumber").val(),
                type: modal.find(".studentType").val(),
                regime: modal.find(".studentRegime").val(),
                turn: modal.find(".studentTurn").val(),
            };
            $.ajax({
                url: 'http://localhost:3000/api/estudantes/' + priorId,
                type: "PUT",
                data: estudante,
                success: function(result) {
                    $.notify(result, "success");
                    presentRow.remove();
                    adicionarEstudante(estudante);
                },
                error: function(result) {
                    $.notify("Impossivel adicionar aluno", "warn");
                    console.log("Deu errado");
                }
            })
        }

        modal.modal("hide")

    })


    //De resto parece tudo bem :)

    function conversaoType(value) {
        switch (value) {
            case "1":
                value = "Normal";
                break;
            case "2":
                value = "Trabalhador";
                break;
            case "3":
                value = "Extraordinário";
                break;
        }
        return value;
    }

    function inversoRegime(value) {
        switch (value) {
            case "Diurno":
                value = '1';
                break;
            case "Pós-Laboral":
                value = '2';
                break;
        }
        return value;
    }

    function conversaoRegime(value) {
        switch (value) {
            case "1":
                value = "Diurno";
                break;
            case "2":
                value = "Pós-Laboral";
                break;
        }
        return value;
    }

    function inversoType(value) {
        switch (value) {
            case "Normal":
                value = "1";
                break;
            case "Trabalhador":
                value = "2";
                break;
            case "Extraordinário":
                value = "3";
                break;
        }
        return value;
    }

    //Função para adicionar um estudante à tabela.
    function adicionarEstudante(estudante) {
        let tdId = "<td>" + estudante.id + "</td>";
        let tdName = "<td>" + estudante.name + "</td>";
        let tdType = "<td>" + conversaoType(estudante.type) + "</td>";
        let tdRegime = "<td>" + conversaoRegime(estudante.regime) + "</td>";
        let tdTurn = "<td>" + estudante.turn + "</td>";


        let tdOptionDelete = "<td><button type='button' studentNr='" + estudante.id + "' class='btn btn-sm btn-danger del'>Delete</button></td>";
        let tdOptionChange = "<td><button type='button' data-target='#myModal' studentNr='" + estudante.id + "' class='btn btn-sm btn-warning change'>Change</button></td>";

        tabela.append("<tr>" + tdId + tdName + tdType + tdRegime + tdTurn + tdOptionDelete + tdOptionChange + "</tr>");
    };
})