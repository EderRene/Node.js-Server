const axios = require('axios');
const database = require('./database');

module.exports.login = login;
module.exports.authenticate = authenticate;
module.exports.logOut = logOut;

var userTokenTable = {};

function login(req, res, googleToken) {
    checkGoogleToken(req, res, googleToken);
}

function authenticate(req, res, next) {
    var secToken = getToken(req);
    var loggedInUser = userTokenTable[secToken];

    if (loggedInUser == undefined) {
        res.status(401).send('Unauthorized');
    }
    req.login = loggedInUser;
    next();
}

function checkGoogleToken(req, res, token) {

    axios.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + token)

        .then(response => {

            if (response.status !== 200 || response.data.aud !== '271184372430-6qtb5ajg14i0fph28u33e6tvv0qhvc42.apps.googleusercontent.com') {

                var email = response.data.email;

                var employee = await database.getEmployeeWithEmail(email);

                if (employee != undefined) {         //schauen ob ein user diese email hat, wenn nicht weg wenn ja dann in tokentable 
                    userTokenTable[token] = user;
                    res.status(200).send(token);
                } else {
                    res.status(401).send('Unauthorized');
                }
            } else {
                res.status(401).send('Unauthorized');
            }
        })

        .catch(error => {
            //console.log(error);
            res.status(401).send('Unauthorized');
            return;
        });

}

function getToken(req) {
    return req.headers['authorization'];
}

function logOut(req) {
    delete userTokenTable[getToken(req)];
}