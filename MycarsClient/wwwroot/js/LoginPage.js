function LoginInit() {
    var login = new LoginPage();
    login.Init();
}
function LoginPage() {
    loginThis = this;
}
LoginPage.prototype = {
    Init: function () {
        loginThis.InitEvent();
    },
    InitEvent: function () {
        $('#btnLogin').click(function () {
            var user = $('#txtUname').val();
            var password = $('#txtPassword').val()
            if (user.toLowerCase() == '' || password.toLowerCase() == '') {
                $('#lblError').text("Empty Credentials");
                return;
            }
            if (user.toLowerCase() == 'raghupathy' && password.toLowerCase() == '123456')
                window.location.replace("http://localhost:5001/Pages/Launch.html");
            else
                $('#lblError').text("Invalid Credentials");
        });
    }
}