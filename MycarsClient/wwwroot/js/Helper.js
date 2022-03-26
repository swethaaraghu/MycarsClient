function Helper()
{
    _serviceUrl = "http://localhost:5000/vehicles/";
}
Helper.prototype = {
    AjaxGet: function (serviceName, successfn)
    {
        $.ajax({
            type: "Get",
            url: _serviceUrl + serviceName,
            contentType: false,
            processData: false,
            data: "",
            crossDomain: false,
            headers:
                { "content-type": "application/json" },
            success: function (json) {
                
                successfn(json);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var message = "Unexpected HTTP error:" + jqXHR.status + ' ' + jqXHR.statusText;
                
                return true;

            },
            dataType: "json",
            contentType: "application/json"
        });
    },
    AjaxPost: function (serviceName,data, successfn) {
        $.ajax({
            type: "Post",
            url: _serviceUrl + serviceName,
            contentType: false,
            processData: false,
            data: JSON.stringify(data),
            crossDomain: false,
            headers:
                { "content-type": "application/json" },
            success: function (json) {

                successfn(json);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var message = "Unexpected HTTP error:" + jqXHR.status + ' ' + jqXHR.statusText;

                return true;

            },
            dataType: "json",
            contentType: "application/json"
        });
    }
}