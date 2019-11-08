const axios = require('axios');


function checkToken(req,res,next,token) {

    axios.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + token)

        .then(response => {

           if (response.status!== 200 || response.data.aud !== '271184372430-6qtb5ajg14i0fph28u33e6tvv0qhvc42.apps.googleusercontent.com') {
           
            res.status(401).send('Unauthorized');

                return;

            }
    
            req.email = response.data.email;

            next();
        })

        .catch(error => {

            //console.log(error);

            res.status(401).send('Unauthorized');

            return;

        });

}

function authenticate(req, res, next) {

    let token = getToken(req);

    checkToken(req,res,next,token);

}

function getToken(req) {

    return req.headers['authorization'];

}

module.exports.authenticate = authenticate;