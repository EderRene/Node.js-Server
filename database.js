const {Client} = require('pg');
const queryStringSelectAllEmployees = "SELECT * FROM employee";
const queryStringSelectAllCamps = "SELECT * FROM camp";
const queryStringSelectEmployeeWIthId = "SELECT * FROM employee WHERE id_Employee=$1";
const queryStringSelectCampWithId = "SELECT * FROM camp WHERE id_Camp=$1";
const queryStringInsertAddress = "INSERT INTO address VALUES(DEFAULT, $1, $2, $3, $4, $5) RETURNING id_Address";
const queryStringInsertEmployee = "INSERT INTO employee VALUES(DEFAULT, $1, $2, TO_DATE($3, 'DD.MM.YYYY'), $4, $5, $6, $7, $8, $9) RETURNING id_Employee";
const queryStringInsertCamp = 'INSERT INTO camp VALUES(DEFAULT, $1, $2, $3)';
const queryStringInsertDocumentType = 'INSERT INTO documentType VALUES($1, $2)';
const queryStringInsertDocument = 'INSERT INTO document VALUES($1, $2, $3, $4)';
const queryStringInsertEmployeeRights = 'INSERT INTO employeeRights VALUES($1, $2)';
const queryStringInsertWorksIn = 'INSERT INTO worksIn VALUES($1, $2)';
const queryStringInsertOwnsRight = 'INSERT INTO ownsRight VALUES($1, $2)';
const queryStringDeleteEmployeeWithId = "DELETE FROM employee WHERE id_Employee=$1";
const queryStringDeleteCampWithId = "DELETE FROM camp WHERE id_Camp=$1";
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
        return 'Connected successfully established';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}
/* #endregion */

/* #region address functions */
async function _insertAddress(address){
    try{
        await client.query(queryStringInsertAddress, [address.addressLine1, address.addressLine2, address.postCode, address.city, address.country]);
        return 'Insert of address was successful';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
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

async function _getEmployeeWithId(id_Employee){
    try{
        let res=await client.query(queryStringSelectEmployeeWIthId, [id_Employee]);
        return res.rows;
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _insertEmployee(employee){
    try{
        //let res=await client.query(queryStringInsertAddress, ["NEXTVAL('seqAddress')", address.addressLine1, address.addressLine2, address.postCode, address.city, address.country]);
        await client.query(queryStringInsertEmployee, [employee.forname, employee.surname, employee.dateOfBirth, employee.id_Address, employee.svn, employee.uid, employee.bankAccountNumber, employee.email, employee.phoneNumber]);
        return 'Insert of employee was successful';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _deleteEmployee(id_Employee){
    try{
        await client.query(queryStringDeleteEmployeeWithId, [id_Employee]);
        return 'Delete of employee was successful';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _updateEmployee(id_Employee, employee){
    try{

    } catch(err){
        throw new Error('Something unexpected happened: ' +err);
    }
}
/* #endregion */

/* #region camp functions */
async function _getAllCamps(){
    try{
        let res=await client.query(queryStringSelectAllCamps);
        return res.rows;
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _getCampWithId(id_Camp){
    try{
        let res=await client.query(queryStringSelectCampWithId, [id_Camp]);
        return res.rows;
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _insertCamp(camp){
    try{
        //let res=await client.query(queryStringInsertAddress, [address.addressLine1, address.addressLine2, address.postCode, address.city, address.country]);
        await client.query(queryStringInsertCamp, [camp.id_Address, camp.name, camp.id_Leader]);
        return 'Insert of camp was successful';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _deleteCamp(id_Camp){
    try{
        await client.query(queryStringDeleteCampWithId, [id_Camp]);
        return 'Delete of camp was successful';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}
/* #endregion */

module.exports.connectToDatabase = _connectToDatabase;
module.exports.getAllEmployees = _getAllEmployees;
module.exports.getAllCamps = _getAllCamps;
module.exports.getEmployeeWithId = _getEmployeeWithId;
module.exports.getCampWithId = _getCampWithId;
module.exports.insertEmployee = _insertEmployee;
module.exports.deleteEmployee = _deleteEmployee;
module.exports.deleteCamp = _deleteCamp;
module.exports.updateEmployee = _updateEmployee;
module.exports.insertAddress = _insertAddress;
module.exports.insertCamp = _insertCamp;