'use strict';

var context = SP.ClientContext.get_current();
var lista;



// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model

function init() {
    lista = context.get_web().get_lists().getByTitle("Personas");
}

function listar() {
    var personas = lista.getItems(new SP.CamlQuery());

    context.load(personas);
    context.executeQueryAsync(function () {
        var html = "<table>";

        var enumeracion = personas.getEnumerator();
        while (enumeracion.moveNext()) {
            html += "<tr>";
            var item = enumeracion.get_current();
            html += "<td>" +
                item.get_item("Nombre") + "</td>" +
                "<td>" +
                item.get_item("Edad") + "</td>" +
                "</tr>";
        }
        html += "</table>";
        $("#listado").html(html);

    }, function (sender, args) {
        alert(args.get_message());

    });


}
function crearPersona() {

    var ici = SP.ListItemCreationInformation();
    var item = lista.addItem(ici);
    item.set_item("Nombre", $("#txtNombre").val());
    item.set_item("Edad", $("#txtEdad").val());

    item.update();
    context.load(item);
    context.executeQueryAsync(function () {
        alert("Opinion creada con exito");
        listar();
    },
        function (sender, args) {

            alert(args.get_message());
        }
    );

}
function CrearPersonaRest() {
    var url = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getByTitle('Personas')/items";
    var digest = $("#__REQUESTDIGEST").val();
    var obj = {
        Nombre: $("#txtNombre").val(),
        Edad: $("#txtEdad").val()
    };
    var objtxt = JSON.stringify(obj);

    $.ajax(
        {
            url: url,
            data: objtxt,
            type: 'POST',
            headers: {
                'accept': 'application/json;odata=verbose',
                'content-type': 'application/json',
                'X-RequestDigest': digest

            },
            success: function () {
                alert("Gracias por el voto");
                listarRest();

            },
            error: function (err) {

                alert(JSON.stringify(err));

            }

        }
    );
}
function listarRest() {

    var url = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getByTitle('Personas')/items";
    $.ajax({
        url: url,
        type: "GET",
        headers: { "accept": "application/json;odata=verbose" },
        success: function (res) {
            var html = "<table>";
            $.each(res.d.results, function (i, result) {
                html += "<tr>";
               
                html += "<td>" +
                   result.Nombre + "</td>" +
                    "<td>" +
                   result.Edad + "</td>" +
                    "</tr>";

            });
            html += "</table>";
            $("#votos").html(votos);
        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });

}

$(document).ready(function () {
    init();
    listar();
    $("#btnAdd").bind("click", crearPersona);
    $("#btnAddRest").bind("click", CrearPersonaRest);
});

// This function prepares, loads, and then executes a SharePoint query to get the current users information
