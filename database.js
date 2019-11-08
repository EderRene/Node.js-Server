const {Client} = require('pg');
const queryStringSelectAllEmployees = "SELECT * FROM employee INNER JOIN address ON employee.id_Address=address.id_Address";
const queryStringSelectAllCamps = "SELECT * FROM camp INNER JOIN address ON camp.id_Address=address.id_Address";
const queryStringSelectAllDocumentTypes = "SELECT * FROM documentType";
const queryStringSelectEmployeeWithId = "SELECT * FROM employee INNER JOIN address ON employee.id_Address=address.id_Address WHERE id_Employee=$1";
const queryStringSelectCampWithId = "SELECT * FROM camp INNER JOIN address ON camp.id_Address=address.id_Address WHERE id_Camp=$1";
const queryStringSelectEmployeeWithEmail = "SELECT * FROM employee WHERE email=$1";
const queryStringInsertAddress = "INSERT INTO address VALUES(DEFAULT, $1, $2, $3, $4, $5) RETURNING id_Address";
const queryStringInsertEmployee = "INSERT INTO employee VALUES(DEFAULT, $1, $2, TO_DATE($3, 'DD.MM.YYYY'), $4, $5, $6, $7, $8, $9) RETURNING id_Employee";
const queryStringInsertCamp = 'INSERT INTO camp VALUES(DEFAULT, $1, $2, $3)';
const queryStringInsertDocumentType = "INSERT INTO documentType VALUES(DEFAULT, $1)";
const queryStringUpdateEmployee = "UPDATE employee SET forename=$1, surname=$2, dateOfBirth=$3, svn=$4, uid=$5, bankAccountNumber=$6, email=$7, phoneNumber=$8 WHERE id_Employee=$9";
const queryStringUpdateAddress = "UPDATE address SET addressLine1=$1, addressLine2=$2, postCode=$3, city=$4, country=$5 WHERE id_Address=$6";
const queryStringUpdateCampLeader = "UPDATE camp SET id_Leader=$1 WHERE id_Camp=$2 AND id_Leader=$3";
const queryStringDeleteEmployeeWithId = "DELETE FROM employee WHERE id_Employee=$1";
const queryStringDeleteCampWithId = "DELETE FROM camp WHERE id_Camp=$1";
const queryStringDeleteWorksInWithIdEmployee = "DELETE FROM worksIn WHERE id_Employee=$1";
const queryStringDeleteWorksInWithIdCamp = "DELETE FROM worksIn WHERE id_Camp=$1";
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
    return new Promise((resolve, reject)=>{
        client.connect()
            .then(()=>{
                resolve(global.successMessages.SUCCESS_DATABASE_CONNECTION_CREATED);
            })
            .catch(()=>{
                reject(global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE);
            });
    });

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
        let result=await client.query(queryStringSelectAllEmployees);
        return result.rows;
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _getEmployeeWithId(id_Employee){
    try{
        let result=await client.query(queryStringSelectEmployeeWithId, [id_Employee]);
        return result.rows;
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _getEmployeeWithEmail(email){
    try{
        let result=await client.query(queryStringSelectEmployeeWithEmail, email);
        return result.rows;
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _insertEmployee(employee){
    try{
        let result=await client.query(queryStringInsertAddress, [employee.addressLine1, employee.addressLine2, employee.postCode, employee.city, employee.country]);
        await client.query(queryStringInsertEmployee, [employee.forename, employee.surname, employee.dateOfBirth, result.rows[0].id_Address, employee.svn, employee.uid, employee.bankAccountNumber, employee.email, employee.phoneNumber]);
        return 'Insert of employee was successful';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _deleteEmployee(id_Employee, id_Camp){
    try{
        await client.query(queryStringUpdateCampLeader, [null, id_Camp, id_Employee]);
        await client.query(queryStringDeleteWorksInWithIdEmployee, [id_Employee]);
        await client.query(queryStringDeleteEmployeeWithId, [id_Employee]);
        return 'Delete of employee was successful';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _updateEmployee(id_Employee, employee){
    try{
        await client.query(queryStringUpdateAddress, [employee.addressLine1, employee.addressLine2, employee.postCode, employee.city, employee.country, employee.id_Address]);
        await client.query(queryStringUpdateEmployee, [employee.forname, employee.surname, employee.dateOfBirth, employee.svn, employee.uid, employee.bankAccountNumber, employee.email, employee.phoneNumber, id_Employee]);
        return 'Update of employee was successful';
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
        let result=await client.query(queryStringInsertAddress, [camp.addressLine1, camp.addressLine2, camp.postCode, camp.city, camp.country]);
        await client.query(queryStringInsertCamp, [result.rows[0].id_address, camp.name, camp.id_Leader]);
        return 'Insert of camp was successful';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _deleteCamp(id_Camp){
    try{
        await client.query(queryStringDeleteWorksInWithIdCamp, [id_Camp]);
        await client.query(queryStringDeleteCampWithId, [id_Camp]);
        return 'Delete of camp was successful';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}
/* #endregion */

/* #region documentType functions */
async function _getAllDocumentTypes(){
    try{
        let result=await client.query(queryStringSelectAllDocumentTypes);
        return result.rows;
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _insertDocumentType(documentType){
    try{
        await client.query(queryStringInsertDocumentType, [documentType.type]);
        return 'Insert of documentType was successful';
    } catch(err){
        throw new Error('Something unexpected happened: ' + err);
    }
}

/* #endregion */

module.exports.connectToDatabase = _connectToDatabase;
module.exports.getAllEmployees = _getAllEmployees;
module.exports.getAllCamps = _getAllCamps;
module.exports.getAllDocumentTypes = _getAllDocumentTypes;
module.exports.getEmployeeWithId = _getEmployeeWithId;
module.exports.getCampWithId = _getCampWithId;
module.exports.getEmployeeWithEmail = _getEmployeeWithEmail;
module.exports.insertEmployee = _insertEmployee;
module.exports.deleteEmployee = _deleteEmployee;
module.exports.deleteCamp = _deleteCamp;
module.exports.updateEmployee = _updateEmployee;
module.exports.insertAddress = _insertAddress;
module.exports.insertCamp = _insertCamp;
module.exports.insertDocumentType = _insertDocumentType;