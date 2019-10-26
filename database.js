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
const queryStringSelectUserWIthId = 'SELECT * FROM userCamp WHERE id_User=$1';

const client=new Client({
    user: 'plonig',
    password: 'plonig',
    host: 'salcher.synology.me',
    port: 5432,
    database: 'zeitverwaltung'
});

function _connectToDatabase(){
    return new Promise((resolve, reject)=>{
        client.connect()
            .then(()=>{
                return resolve('Connected successfully');
            })
            .catch((err)=>{
                return reject('Something unexpexted happened: ' + err);
            });
    });
}

function _getAllUsers(){
    return new Promise((resolve, reject)=>{
        client.query(queryStringSelectUserCampAll)
            .then((res)=>{
                return resolve(res);
            })
            .catch((err)=>{
                return reject('Something unexpected happened: ' + err);
            });
    });
}

function _getUserWithId(idUser){
    return new Promise((resolve, reject)=>{
        client.query(queryStringSelectUserWIthId, [idUser])
            .then((res)=>{
                return resolve(res);
            })
            .catch((err)=>{
                return reject('Something unexpected happened: ' + err);
            });
    });
}

function _insertUser(){

}

function _deleteUser(){

}

function _updateUser(){

}

module.exports.connectToDatabase = _connectToDatabase;
module.exports.getAllUsers = _getAllUsers;
module.exports.getUserWithId = _getUserWithId;
module.exports.insertUser = _insertUser;
module.exports.deleteUser = _deleteUser;
module.exports.updateUser = _updateUser;