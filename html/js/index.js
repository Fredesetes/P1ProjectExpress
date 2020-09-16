$(function() {
    /*let estudantes;
    $.get('http://localhost:3000/api/estudantes', function(data) {
        estudantes = data;
    });*/
    /*$("#log").click(function() {
        let user = { id: $("#ID").val() };
        $.post('http://localhost:3000/api/login',
            user.id,
            function(data) {

                //console.log(data);
            })


    })*/
    $("#sideNavOpen").click(function() {
        document.getElementById("mySidenav").style.width = "250px";
        //document.getElementById("mySidenav").style.marginLeft = "250px";

    })

    $("#sideNavClose").click(function() {
        document.getElementById("mySidenav").style.width = "0";
    })
})