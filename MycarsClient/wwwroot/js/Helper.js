function Helper()
{
    _serviceUrl = "http://localhost:5000/vehicles/";
}
Helper.prototype =
{
    AjaxGet: function (serviceName, successfn,data)
    {
        if (data != null)
            data = JSON.stringify(data);

        $.ajax({
            type: "Get",
            url: _serviceUrl + serviceName,
            contentType: false,
            processData: false,
            data: data,
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
    },
    AjaxPatch: function (serviceName, data, successfn) {
        $.ajax({
            type: "Patch",
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