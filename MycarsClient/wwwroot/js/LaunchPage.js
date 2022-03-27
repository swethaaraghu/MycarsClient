function InitLaunchPage()
{
    var lp = new LaunchPage();
    lp.Init();
}
function LaunchPage()
{
    launchPageThis = this;
    activeTab = "DashBoard";
    searchParams = null;
}
LaunchPage.prototype = {

    Init: function ()
    {
        launchPageThis.InitEvents();
        //launchPageThis.InitiateMap();
    },
    InitEvents: function ()
    {
        searchParams = new URLSearchParams(window.location.search)
        var customerName = searchParams.get('CustomerName')

        $("#ifmMain").attr("src", _mapPageUrl + "?CustomerName=" + customerName);

        $("#Search").keyup(function () {
            launchPageThis.SearchMenu();
        });

        $('#logout').click(function () {
            window.location.replace(_loginUrl);
        });

        $('#liDashBoard').click(function () {
            if (activeTab != "DashBoard")
                $("#ifmMain").attr("src", _mapPageUrl + "?CustomerName=" + customerName);
            activeTab = "DashBoard"
        });

        $('#liVehicles').click(function ()
        {
            if (activeTab == "DashBoard")
                $("#ifmMain").attr("src", _vehicleUrl + "?CustomerName=" + customerName);
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