$(function() {
    //Guarda a Tabela numa variável para depois adicionar os estudantes.
    let tabela = $("#tabelaEstudantes tbody");

    //GET: Recebe todos os estudantes da base de dados.
    $.get('http://localhost:3000/api/estudantes', function(data) {
        data.forEach((estudante) => {
            adicionarEstudante(estudante);
        });
    });
    
    //Adiciona um Estudante
    $('#button').click(function() {
        if ($("#studentName").val() == "" || $("#studentNumber").val() == "") {
            $.notify("Impossível adicionar aluno", "warn");
        } else {
            let estudante = {
                name: $("#studentName").val(),
                id: $("#studentNumber").val(),
                type: $("#studentType").val(),
                regime: $("#studentRegime").val(),
                turn: $("#studentTurn").val()
            };
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
    
    //Altera UM Estudante
    tabela.on("click", ".change", function() {
        //Tens de guardar o modal em algum lado!
        //Podes não usar JavaScript para 'abrir' o modal
        //Quando carregas no butão de change:
        // - Vais buscar os valores que estão na linha da tabela.
        // - Metes esses valores nos inputs do modal.
        // - No fim mostras o Modal. (quando ele não está visivel não interessa se tem algo escrito)
        //Refer to: https://getbootstrap.com/docs/4.5/components/modal/#live-demo
        $('#mymodal').modal();

        //Esta parte do codigo não tem de estar aqui dentro
        //Podes ter isto fora do click do butão de alterar estudante
        $('#mymodal .changeBtn').click(function() {
            if ($("#mymodal .studentName").val() == "") {
                $.notify("Impossível adicionar aluno", "warn");
            } else {
                let estudante = {
                    name: $("#mymodal .studentName").val(),
                    id: $("#mymodal .studentNumber").val(),
                    type: $("#mymodal .studentType").val(),
                    regime: $("#mymodal .studentRegime").val(),
                    turn: $("#mymodal .studentTurn").val()
                };
                $.ajax({
                    url: `http://localhost:3000/api/estudantes/${$(this).attr("studentNr")}`,
                    type: "PUT",
                    data: estudante,
                    success: function(result) {
                        $.notify(result, "success");

                    }
                })
            }
        })
        
        //De resto parece tudo bem :)
    })

    //Função para adicionar um estudante à tabela.
    function adicionarEstudante(estudante) {
        let tdId = "<td>" + estudante.id + "</td>";
        let tdName = "<td>" + estudante.name + "</td>";
        let tdType = "<td>" + estudante.type + "</td>";
        let tdRegime = "<td>" + estudante.regime + "</td>";
        let tdTurn = "<td>" + estudante.turn + "</td>";


        let tdOptionDelete = "<td><button type='button' studentNr='" + estudante.id + "' class='btn btn-sm btn-danger del'>Delete</button></td>";
        let tdOptionChange = "<td><button type='button' studentNr='" + estudante.id + "' class='btn btn-sm btn-warning change'>Change</button></td>";

        tabela.append("<tr>" + tdId + tdName + tdType + tdRegime + tdTurn + tdOptionDelete + tdOptionChange + "</tr>");
    };
})
