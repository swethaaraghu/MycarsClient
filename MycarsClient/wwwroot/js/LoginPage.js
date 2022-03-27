function LoginInit()
{
    var login = new LoginPage();
    login.Init();
}
function LoginPage() {
    loginThis = this;
    helper = new Helper();
}
LoginPage.prototype = {
    Init: function () {
        loginThis.InitEvent();
    },
    InitEvent: function ()
    {
        $('#btnLogin').click(function () {
            var user = $('#txtUname').val();
            var password = $('#txtPassword').val()
            if (user.toLowerCase() == '' || password.toLowerCase() == '') {
                $('#lblError').text("Empty Credentials");
                return;
            }
           
                loginThis.AuthenticateCustomer(user, password);
        });
    },
    AuthenticateCustomer: function (user, password) {
        var customer = {
            CustomerName: user,
            Password: password
        }
        helper.AjaxPost("AuthenticateCustomer", JSON.stringify(customer), function (json) {
            if (json == 1)
            {
                window.location.replace(_launchUrl + "?CustomerName=" + user);
            }
            else
                $('#lblError').text("Invalid Credentials");
        });
    }
}