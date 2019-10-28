document.addEventListener("DOMContentLoaded", function(event) {
    init();
  });

function renderButton() {
    gapi.signin2.render('gSignIn', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSignUpSuccess,
    });
}
function init(){
    gapi.load('auth2', () => { 
        googleAuth = gapi.auth2.init({ 
            client_id:'271184372430-6qtb5ajg14i0fph28u33e6tvv0qhvc42.apps.googleusercontent.com' , 
            fetch_basic_profile: false, 
            scope: 'profile email' 
        }); 
        googleAuth.currentUser.listen(onSignUpSuccess); 
    }); 
    renderButton();
}



// Sign-in success callback
function onSignUpSuccess(googleUser) {

    var profile = googleUser.getBasicProfile();
    console.log(profile);
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
    // Retrieve the Google account data
    gapi.client.load('oauth2', 'v2', function () {
        var request = gapi.client.oauth2.userinfo.get({
            'userId': 'me'
        });
        request.execute(function (resp) {
            // Display the user details
            var profileHTML = '<h3>Welcome ' + resp.given_name + '! <a href="javascript:void(0);" onclick="signOut();">Sign out</a></h3>';
            profileHTML += '<img src="' + resp.picture + '"/><p><b>Google ID: </b>' + resp.id + '</p><p><b>Name: </b>' + resp.name + '</p><p><b>Email: </b>' + resp.email + '</p><p><b>Gender: </b>' + resp.gender + '</p><p><b>Locale: </b>' + resp.locale + '</p><p><b>Google Profile:</b> <a target="_blank" href="' + resp.link + '">click to view profile</a></p>';
            document.getElementsByClassName("userContent")[0].innerHTML = profileHTML;

            document.getElementById("gSignIn").style.display = "none";
            document.getElementsByClassName("userContent")[0].style.display = "block";
        });
    });
}

// Sign-in failure callback

// Sign out the user
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        document.getElementsByClassName("userContent")[0].innerHTML = '';
        document.getElementsByClassName("userContent")[0].style.display = "none";
        document.getElementById("gSignIn").style.display = "block";
    });

    auth2.disconnect();
}