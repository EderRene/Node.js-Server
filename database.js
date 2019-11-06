const {Client} = require('pg');
const queryStringSelectAllEmployees = 'SELECT * FROM employee';
const queryStringSelectEmployeeWIthId = 'SELECT * FROM employee WHERE id_User=$1';
const queryStringInsertAddress = 'INSERT INTO address VALUES($1, $2, $3, $4, $5, $6)';
const queryStringInsertEmployee = 'INSERT INTO employee VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
const queryStringInsertCamp = 'INSERT INTO camp VALUES($1, $2, $3, $4)';
const queryStringInsertDocumentType = 'INSERT INTO documentType VALUES($1, $2)';
const queryStringInsertDocument = 'INSERT INTO document VALUES($1, $2, $3, $4)';
const queryStringInsertEmployeeRights = 'INSERT INTO employeeRights VALUES($1, $2)';
const queryStringInsertWorksIn = 'INSERT INTO worksIn VALUES($1, $2)';
const queryStringInsertOwnsRight = 'INSERT INTO ownsRight VALUES($1, $2)';
const queryStringDeleteEmployeeWithId = 'DELETE FROM employee WHERE idEmployee=$1';
var Employee = require('./dataModels/employee.js');
var Address = require('./dataModels/address.js');
var Camp = require('./dataModels/camp.js');

const client=new Client({
    user: 'plonig',
    password: 'plonig',
    host: 'salcher.synology.me',
    port: 5432,
    database: 'zeitverwaltung'
});

/* #region connection functions */
async function _connectToDatabase(){
    try{
        await client.connect();
        return 'Connected successfully';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}
/* #endregion */

/* #region address functions */
function _insertAdress(address){
    try{
        await client.query(queryStringInsertAddress, ["NEXTVAL('seqAddress')", address.addressLine1, address.addressLine2, address.postCode, address.city, address.country]);
        return 'Insert of new address was successful';
    } catch(err){
        throw new Error('Something unexpcted happened: ' +err);
    }
}
/* #endregion */

/* #region employee functions */
async function _getAllEmployees(){
    try{
        let res=await client.query(queryStringSelectAllEmployees);
        return res.rows;
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _getEmployeerWithId(idUser){
    try{
        let res=await client.query(queryStringSelectEmployeeWIthId, [idUser]);
        return res.rows;
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _insertEmployee(employee){
    try{
        await client.query(queryStringInsertEmployee, ["NEXTVAL('seqEmployee')", employee.forname, employee.surname, employee.dateOfBirth, employee.idAdress, employee.svn, employee.uid, employee.bankAccountNumber, employee.email, employee.phoneNumber]);
        return 'Insert of employee was successful';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _deleteEmployee(){
    try{
        await client.query(queryStringDeleteEmployeeWithId, [employee.idEmployee]);
        return 'Delete was successful';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _updateEmployee(){
    try{

    } catch(err){
        throw new Error('Something unexpected happened: ' +err);
    }
}
/* #endregion */

/* #region camp functions */
async function insertCamp(camp){
    try{
        
    }
}

/* #endregion */

module.exports.connectToDatabase = _connectToDatabase;
module.exports.getAllUsers = _getAllUsers;
module.exports.getUserWithId = _getUserWithId;
module.exports.insertAddress = _insertAdress;
module.exports.insertEmployee = _insertEmployee;
module.exports.deleteEmployee = _deleteEmployee;
module.exports.updateEmployee = _updateEmployee;