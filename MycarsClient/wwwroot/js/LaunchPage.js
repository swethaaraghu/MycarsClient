function InitLaunchPage()
{
    var lp = new LaunchPage();
    lp.Init();
}
function LaunchPage()
{
    launchPageThis = this;
    activeTab = "DashBoard";
}
LaunchPage.prototype = {

    Init: function ()
    {
        launchPageThis.InitEvents();
        //launchPageThis.InitiateMap();
    },
    InitEvents: function ()
    {
        $("#ifmMain").attr("src", _mapPageUrl);

        $("#Search").keyup(function () {
            launchPageThis.SearchMenu();
        });

        $('#liDashBoard').click(function () {
            if (activeTab != "DashBoard")
                $("#ifmMain").attr("src", _mapPageUrl);
            activeTab = "DashBoard"
        });

        $('#liVehicles').click(function ()
        {
            if (activeTab == "DashBoard")
                $("#ifmMain").attr("src", _vehicleUrl);
            activeTab = "Vehicle";
        });
    },
    SearchMenu: function ()
    {
        var input, filter, ul, li, a, i;

        input = document.getElementById("Search");
        filter = input.value.toUpperCase();
        ul = document.getElementById("Menu");
        li = ul.getElementsByTagName("li");

        for (i = 0; i < li.length; i++)
        {
            a = li[i].getElementsByTagName("a")[0];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }
}