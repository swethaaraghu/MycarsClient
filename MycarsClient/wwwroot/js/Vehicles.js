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
    isVehicleAdded = false;
    CustomerName = null;
}
Vehicles.prototype = {

    Init: function ()
    {
        vehicleThis.InitEvent();
        vehicleThis.GetAllVehicle();
       
    },
    InitEvent: function ()
    {
        var searchParams = new URLSearchParams(window.location.search)
        CustomerName = searchParams.get('CustomerName')

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

        $('#mdlAddVehicle #btnAdd').click(function ()
        {
            $('#mdlAddVehicle #successMsg').text("");
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
            isVehicleAdded = true;
            //$('#mdlAddVehicle').hide(); 
           
            vehicleThis.AddVehicle(vin, lp, drivername, office)
        });

    },
    ClearFields: function () {
        $('#mdlAddVehicle #txtPlate').val('');
        $('#mdlAddVehicle #txtVin').val('');
        $('#mdlAddVehicle #txtDriverName').val('');
        $('#mdlAddVehicle #txtOffice').val('');
        $('#mdlAddVehicle #errormsg').text("");
        $('#mdlAddVehicle #successMsg').text("");
    },
    SaveEditedVehicle: function (vin, lp, drivername,office) {

        var vehicle = {
            VinNumber: vin,
            DriverName: drivername,
            Office: office,
            LicensePlateNumber: lp,
            CustomerName: CustomerName
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
            LicensePlateNumber: lp,
            CustomerName: CustomerName
        }

        helper.AjaxPatch("AddVehicle", JSON.stringify(vehicle), function (json)
        {
            if (json == 1) {
                vehicleThis.ClearFields();
                $('#mdlAddVehicle #successMsg').text("Changes Saved");
            }
            else if(json == 2)
                $('#mdlAddVehicle #errormsg').text("Vin number already exists");
            else
                $('#mdlAddVehicle #errormsg').text("Error Occured");

        });
    },
    ClearContent: function () {
        $('#grdVehicles').html('');
        var head = "<div class='card' style='width: 100%; height: 50px; margin-bottom: 10px;display: flex; '>" +
            "<div class='col-2' style='padding-left:5px; width: 100%;'>" +
            "<h5>Driver Name</h5>" +
            "</div>" +
            "<div class='col-3' style='width: 100%;'>" +
            "<h5>Vin Number</h5>" +
            "</div>" +
            "<div class='col-2' style='width: 100%;'>" +
            "<h5> Speed </h5>" +
            "</div>" +
            "<div class='col-3' style='width: 100%;'>" +
            "<h5> License Plate</h5>" +
            "</div>" +
            "<div class='col-2' style='width: 100%;'>" +
            "<h5> Office </h5>" +
            "</div>" +
            "</div >"
        $('#grdVehicles').append(head);
    },
    GetVehicleByVin: function (vin) {
        var vehicle = {
            SearchText: vin,
            CustomerName: CustomerName
        }
        helper.AjaxPost("GetVehicleByVin", JSON.stringify(vehicle), function (json) {
            if (json != null)
            {
                vehicleThis.ClearContent();
                if (json.length == 0)
                    $('#grdVehicles').html("<center>No Record</center>")
                //window.top.MessageBox.Info("No Records Found");
                else {
                    
                    // window.top.MessageBox.Success("Records");
                    vehicleThis.BuildVehicleData(json);
                }
            }
        });
    },
    GetAllVehicle: function ()
    {
        if (rowCount == 0)
            vehicleThis.ClearContent();

        var vehicle = {
            Count: rowCount,
            CustomerName: CustomerName
        }
        helper.AjaxPost("GetAllVehicle", JSON.stringify(vehicle), function (json) {
            var result = json;
            if (result == undefined || result == null) {
                isPageEnd = true;                
            }
            else
            {
                if (json.length == 0)
                    $('#grdVehicles').html("<center>No Record</center>")
                else
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
                "<h5 id='dr" + vehicle.vinNumber + "'>" + vehicle.driverName + "</h5>" +
                "</div>" +
                "<div class='col-3' style='width: 100%;'>" +
                " <h5 id='vin" + vehicle.vinNumber + "'> " + vehicle.vinNumber + "</h5>" +
                "</div>" +
                "<div class='col-2' style='width: 100%;'>" +
                "<h5 id='s" + vehicle.vinNumber + "' > " + vehicle.status.speed + "</h5>" +
                "</div>" +
                "<div class='col-3' style='width: 100%;'>" +
                "<h5 id='lp" + vehicle.vinNumber + "'>" + vehicle.licensePlateNumber + "</h5>" +
                "</div>" +
                "<div class='col-2' style='width: 100%;'>" +
                "<h5 id='off" + vehicle.vinNumber + "' > " + vehicle.office + "</h5>" +
                "</div>" +
                "</div>" +
                "</div >";

            $('#grdVehicles').append(tag);
        });
    }
}
