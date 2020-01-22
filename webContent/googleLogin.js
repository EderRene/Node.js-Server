function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSignUpSuccess,
        'onfailure': onSignUpFailure
    });
}

function init() {
    gapi.load('auth2', () => {
        googleAuth = gapi.auth2.init({
            client_id: '271184372430-6qtb5ajg14i0fph28u33e6tvv0qhvc42.apps.googleusercontent.com',
            fetch_basic_profile: true,
            scope: 'profile email'
        });
    });
    renderButton();
}

// Sign-in success callback
function onSignUpSuccess(googleUser) {

    var profile = googleUser.getBasicProfile();
    console.log(profile);

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;

   // alert("ID Token: " + id_token);

   alert("Hallo " + profile.getName());
   loginRequest(id_token);


    // Retrieve the Google account data
    gapi.client.load('oauth2', 'v2', function () {
        var request = gapi.client.oauth2.userinfo.get({
            'userId': 'me'
        });
        request.execute(function (resp) {
            // Display the user details
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.disconnect();
        });
    });
}

// Sign-in failure callback
function onSignUpFailure(error) {
    alert(error);
}
// Sign out the user
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {

    });

    auth2.disconnect();
}

function loginRequest(id_token) {
    $.ajax('/api/login', {
        type: 'POST',  // http method
        data: JSON.stringify({ "token": id_token }),
        contentType: 'application/json; charset=utf-8',
        success: function (data, status, xhr) {
            alert("login success!")
            localStorage.setItem('google-token', id_token);
        },
        error: function (jqXhr, textStatus, errorMessage) {
            alert("login failed");
        }
    });
}