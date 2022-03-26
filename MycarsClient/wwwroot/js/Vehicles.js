function InitVehicles()
{
    var v = new Vehicles();
    v.Init();
}
function Vehicles()
{
    vehicleThis = this;
    helper = new Helper();
    grdVehicles = null;
}
Vehicles.prototype = {

    Init: function ()
    {
        vehicleThis.InitEvent();
        vehicleThis.GetAllVehicle();
       
    },
    InitEvent: function ()
    {
        $('#btnRefresh').click(function () {

            vehicleThis.ClearContent();
            vehicleThis.GetAllVehicle();
        });
        $('#btnSearch').click(function ()
        {
            var searchVal = $('#inpSearch').val();
            vehicleThis.GetVehicleByVin(searchVal);
        });
    },
    ClearContent: function () {
        $('#grdVehicles').html('');
        var head = "<div class='row card' style='width: 100%; height: 50px; margin-bottom: 10px '>" +
            "<div class='col-3' style='padding-left:5px; width: 100%;'>" +
            "<h4>Driver Name</h4>" +
            "</div>" +
            "<div class='col-3' style='width: 100%;'>" +
            " <h4>Vin Number</h4>" +
            "</div>" +
            "<div class='col-3' style='width: 100%;'>" +
            "<h4> License PlateNumber </h4>" +
            "</div>" +
            "<div class='col-3' style='width: 100%;'>" +
            "<h4> Speed </h4>" +
            "</div>" +
            "</div >"
        $('#grdVehicles').append(head);
    },
    GetVehicleByVin: function (vin) {
        
        helper.AjaxPost("GetVehicleByVin", vin, function (json) {
            vehicleThis.ClearContent();
            if (json.length == 0)
                $('#grdVehicles').html("<center>No Record</center>")
                //window.top.MessageBox.Info("No Records Found");
            else
            {
                var result = json;
               // window.top.MessageBox.Success("Records");
                result.forEach(function (vehicle) {

                    var tag = " <div class='card' style='width: 100%; height: 50px; margin-bottom: 10px '>" +
                        "<a> <i class='fa fa-edit' style='float:right; margin-top:5px;margin-right:5px'></i></a>" +
                        "<div class='row'>" +
                        "<div class='col-3' style='padding-left:5px; width: 100%;'>" +
                        "<h4>" + vehicle.driverName + "</h4>" +
                        "</div>" +
                        "<div class='col-3' style='width: 100%;'>" +
                        " <h4> " + vehicle.vinNumber + "</h4>" +
                        "</div>" +
                        "<div class='col-3' style='width: 100%;'>" +
                        "<h4> " + vehicle.licensePlateNumber + "</h4>" +
                        "</div>" +
                        "<div class='col-3' style='width: 100%;'>" +
                        "<h4> " + vehicle.status.speed + "</h4>" +
                        "</div>" +
                        "</div>" +
                        "</div >"
                    $('#grdVehicles').append(tag);
                });
            }
        });
    },
    GetAllVehicle: function ()
    {
        helper.AjaxGet("GetAllVehicle", function (json) {
            var result = json;
            result.forEach(function (vehicle) {
                
                var tag = " <div class='card' style='width: 100%; height: 50px; margin-bottom: 10px '>"+
                    "<a> <i class='fa fa-edit' style='float:right; margin-top:5px;margin-right:5px'></i></a>"+
                        "<div class='row'>"+
                    "<div class='col-3' style='padding-left:5px; width: 100%;'>" +
                    "<h4>" + vehicle.driverName + "</h4>" +
                            "</div>"+
                            "<div class='col-3' style='width: 100%;'>"+
                                " <h4> " + vehicle.vinNumber+"</h4>"+
                            "</div>"+
                            "<div class='col-3' style='width: 100%;'>"+
                                "<h4> " + vehicle.licensePlateNumber+"</h4>"+
                            "</div>"+
                            "<div class='col-3' style='width: 100%;'>"+
                                "<h4> " + vehicle.status.speed+"</h4>"+
                            "</div>"+
                        "</div>"+
                    "</div >"
                $('#grdVehicles').append(tag);
            });
        });
    },

}
