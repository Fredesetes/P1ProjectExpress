$(function() {
    let tabela = $("#tabelaEstudantes tbody");
    $.get('http://localhost:3000/api/estudantes', function(data) {
        data.forEach((estudante) => {
            adicionarEstudante(estudante);
        });
    });
    $('#button').click(function() {
        if ($("#studentName").val() == "" || $("#studentNumber").val() == "") {
            $.notify("Impossível adicionar aluno", "warn");
        } else {
            let estudante = {
                name: $("#studentName").val(),
                id: $("#studentNumber").val()
            };
            $.post('http://localhost:3000/api/estudantes', estudante, function(data) {
                $.notify(data, "success");
                adicionarEstudante(estudante);
            })
            $("#studentName").val("")
            $("#studentNumber").val("")
        }
    });

    $('#studentName').keyup(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $('#button').click();
        }

    })

    $('#delete').click(function() {
        $.ajax({
            url: 'http://localhost:3000/api/estudantes',
            type: "DELETE",
            success: function(result) {
                $.notify(result, "success")
                tabela.html("")
            }
        })
    })


    function adicionarEstudante(estudante) {
        tabela.append("<tr><td>" + estudante.id + "</td><td>" + estudante.name + "</td></tr>");
    }
})