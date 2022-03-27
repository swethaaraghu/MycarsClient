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
    selectedvehicle = '';
    rowCount = 0;
    isPageEnd = false;
}
Vehicles.prototype = {

    Init: function ()
    {
        vehicleThis.InitEvent();
        vehicleThis.GetAllVehicle();
       
    },
    InitEvent: function ()
    {
        $('#grdVehicles').delegate("a.edit", "click", function ()
        {
            $('#mdlEditVehicle #errormsg').text("");
            var id = $(this).attr('id');
            var vin = id.replace('edit', '');
            var lp = $('#lp' + vin).text();
            var drivername = $('#dr' + vin).text();
            var office = $('#off' + vin).text();
            var speed = $('#s' + vin).text();
            $('#mdlEditVehicle').modal({
                backdrop: false,
                show: true
            });
            selectedvehicle = vin;
            
            $('#mdlEditVehicle #txtVin').val(vin);
            $('#mdlEditVehicle #txtPlate').val(lp);
            $('#mdlEditVehicle #txtDriverName').val(drivername);
            $('#mdlEditVehicle #txtSpeed').val(speed);
            $('#mdlEditVehicle #txtOffice').val(office);
        });

        $('#mdlEditVehicle #btnSave').click(function () {
            var lp =  $('#mdlEditVehicle #txtPlate').val();
            var vin = $('#mdlEditVehicle #txtVin').val();
            var drivername = $('#mdlEditVehicle #txtDriverName').val();
            var office = $('#mdlEditVehicle #txtOffice').val();
            if (lp == '' || vin == '' || drivername== '')
            {
                $('#mdlEditVehicle #errormsg').text("Values are empty");
                return;
            }
            //$("#mdlEditVehicle .closed").click()
            //$("#mdlEditVehicle").hide();
            $('#vin' + selectedvehicle).text(vin);
            $('#lp' + selectedvehicle).text(lp);
            $('#dr' + selectedvehicle).text(drivername);
            $('#off' + selectedvehicle).text(office);
            vehicleThis.SaveEditedVehicle(vin, lp, drivername,office)
           
        });

        $('#btnRefresh').click(function ()
        {
            rowCount = 0;
            isPageEnd = false;
            vehicleThis.ClearContent();
            vehicleThis.GetAllVehicle();
        });

        $('#btnSearch').click(function ()
        {
            var searchVal = $('#inpSearch').val();
            isPageEnd = true;
            if (searchVal != '')
                vehicleThis.GetVehicleByVin(searchVal);
        });

        $('#btnAdd').click(function () {
            $('#mdlAddVehicle').modal({
                backdrop: false,
                show: true
            });
        });

        $(window).scroll(function () {
            if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
                if (!isPageEnd) {
                    rowCount = rowCount + 10;
                    vehicleThis.GetAllVehicle();
                }
            }
        });

        $('#mdlAddVehicle #btnAdd').click(function () {
            var lp = $('#mdlAddVehicle #txtPlate').val();
            var vin = $('#mdlAddVehicle #txtVin').val();
            var drivername = $('#mdlAddVehicle #txtDriverName').val();
            var office = $('#mdlAddVehicle #txtOffice').val();

            if (lp == '' || vin == '' || drivername == '' || office == '')
            {
                $('#mdlAddVehicle #errormsg').text("Values are empty");
                return;
            }
            if (vin.length != 17)
            {
                $('#mdlAddVehicle #errormsg').text("Vin number must have 17 characters");
                return;
            }

            //$('#mdlAddVehicle').hide(); 
            $('#mdlAddVehicle #txtPlate').val('');
            $('#mdlAddVehicle #txtVin').val('');
            $('#mdlAddVehicle #txtDriverName').val('');
            $('#mdlAddVehicle #txtOffice').val('');
            $('#mdlAddVehicle #errormsg').text("");
            vehicleThis.AddVehicle(vin, lp, drivername, office)
        });

    },
    SaveEditedVehicle: function (vin, lp, drivername,office) {

        var vehicle = {
            VinNumber: vin,
            DriverName: drivername,
            Office: office,
            LicensePlateNumber: lp
        }

        helper.AjaxPatch("SaveEditedVehicle", JSON.stringify(vehicle), function (json) {
            if (json == 1)
                alert("Changes Saved");
            else
                alert("Error occured while Saving");
        });

    },
    AddVehicle: function (vin, lp, drivername, office) {
        var vehicle = {
            VinNumber: vin,
            DriverName: drivername,
            Office: office,
            LicensePlateNumber: lp
        }

        helper.AjaxPatch("AddVehicle", JSON.stringify(vehicle), function (json)
        {
            if (json == 1)
                $('#mdlAddVehicle #successMsg').text("Changes Saved");
            else
                $('#mdlAddVehicle #errorMsg').text("Error occured while Saving");

            setTimeout(function () {
                $("#mdlAddVehicle #errormsg #successMsg").text('');
            }, 2000);

        });
    },
    ClearContent: function () {
        $('#grdVehicles').html('');
        var head = "<div class='card' style='width: 100%; height: 50px; margin-bottom: 10px;display: flex; '>" +
            "<div class='col-2' style='padding-left:5px; width: 100%;'>" +
            "<h4>Driver Name</h4>" +
            "</div>" +
            "<div class='col-3' style='width: 100%;'>" +
            " <h4>Vin Number</h4>" +
            "</div>" +
            "<div class='col-3' style='width: 100%;'>" +
            "<h4> License Plate</h4>" +
            "</div>" +
            "<div class='col-2' style='width: 100%;'>" +
            "<h4> Speed </h4>" +
            "</div>" +
            "<div class='col-2' style='width: 100%;'>" +
            "<h4> Office </h4>" +
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
                vehicleThis.BuildVehicleData(result);
            }
        });
    },
    GetAllVehicle: function ()
    {
        if (rowCount == 0)
            vehicleThis.ClearContent();

        helper.AjaxPost("GetAllVehicle", JSON.stringify(rowCount), function (json) {
            var result = json;
            if (result == undefined || result == null)
                isPageEnd = true;
            else
            {
                vehicleThis.BuildVehicleData(result);
            }
        });
    },
    BuildVehicleData: function (result)
    {
        result.forEach(function (vehicle) {

            var tag = " <div class='card' style='width: 100%; height: 50px; margin-bottom: 10px '>" +
                "<a href='javascript: void(0)' class='edit' id='edit" + vehicle.vinNumber + "'> <i class='fa fa-edit' style='float:right; margin-top:5px;margin-right:5px'></i></a>" +
                "<div class='row'>" +
                "<div class='col-2' style='padding-left:5px; width: 100%;'>" +
                "<h4 id='dr" + vehicle.vinNumber + "'>" + vehicle.driverName + "</h4>" +
                "</div>" +
                "<div class='col-3' style='width: 100%;'>" +
                " <h4 id='vin" + vehicle.vinNumber + "'> " + vehicle.vinNumber + "</h4>" +
                "</div>" +
                "<div class='col-3' style='width: 100%;'>" +
                "<h4 id='lp" + vehicle.vinNumber + "'>" + vehicle.licensePlateNumber + "</h4>" +
                "</div>" +
                "<div class='col-2' style='width: 100%;'>" +
                "<h4 id='s" + vehicle.vinNumber + "' > " + vehicle.status.speed + "</h4>" +
                "</div>" +
                "<div class='col-2' style='width: 100%;'>" +
                "<h4 id='off" + vehicle.vinNumber + "' > " + vehicle.office + "</h4>" +
                "</div>" +
                "</div>" +
                "</div >";

            $('#grdVehicles').append(tag);
        });
    }
}
