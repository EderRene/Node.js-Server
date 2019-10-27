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

async function _connectToDatabase(){
    try{
        await client.connect();
        return 'Connected successfully';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _getAllUsers(){
    try{
        let res=await client.query(queryStringSelectUserCampAll);
        return res;
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _getUserWithId(idUser){
    try{
        let res=await client.query(queryStringSelectUserWIthId, [idUser]);
        return res;
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
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