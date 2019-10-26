const {Client} = require('pg');
const queryStringInsertAddress = 'INSERT INTO address VALUES($1, $2, $3, $4, $5, $6)';
const queryStringInsertUserCamp = 'INSERT INTO userCamp VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
const queryStringInsertCamp = 'INSERT INTO camp VALUES($1, $2, $3, $4)';
const queryStringInsertDocumentType = 'INSERT INTO documentType VALUES($1, $2)';
const queryStringInsertDocument = 'INSERT INTO document VALUES($1, $2, $3, $4)';
const queryStringInsertUserRights = 'INSERT INTO userRights VALUES($1, $2)';
const queryStringInsertWorksIn = 'INSERT INTO worksIn VALUES($1, $2)';
const queryStringInsertOwnsRight = 'INSERT INTO ownsRight VALUES($1, $2)';
const queryStringSelectUserCampAll = 'SELECT * FROM userCamp';

const client=new Client({
    user: 'plonig',
    password: 'plonig',
    host: 'salcher.synology.me',
    port: 5432,
    database: 'zeitverwaltung'
});

function _connectToDatabase(){
    client.connect()
    .then(()=>{
        return ('Connected successfully');
    })
    .catch((err)=>{
        return ('Something unexpexted happened: ' + err);
    });
}

function _getAllUsers(){
    client.query(queryStringSelectUserCampAll)
        .then((res)=>{
            return res;
        })
        .catch((err)=>{
            return ('Something unexpected happened: ' + err);
        });
}

module.exports.getAllUsers = _getAllUsers;
module.exports.connectToDatabase = _connectToDatabase;