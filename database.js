const {Pool, Client} = require('pg');
const queryStringSelectAllEmployees = "SELECT e.id_Employee, e.forename, e.surname, TO_CHAR(e.dateOfBirth, 'DD.MM.YYYY'), e.id_Address, e.svn, e.uid, e.bankAccountNumber, e.email, e.phoneNumber, a.addressLine1, a.addressLine2, a.postCode, a.city, a.country FROM employee e INNER JOIN address a ON e.id_Address=a.id_Address";
const queryStringSelectAllCamps = "SELECT c.id_Camp, c.id_Address, c.name, c.id_Leader, a.addressLine1, a.addressLine2, a.postCode, a.city, a.country FROM camp c INNER JOIN address a ON c.id_Address=a.id_Address";
const queryStringSelectAllDocumentTypes = "SELECT id_DocumentType, type FROM documentType";
const queryStringSelectEmployeeWithId = "SELECT e.id_Employee, e.forename, e.surname, TO_CHAR(e.dateOfBirth, 'DD.MM.YYYY'), e.id_Address, e.svn, e.uid, e.bankAccountNumber, e.email, e.phoneNumber, a.addressLine1, a.addressLine2, a.postCode, a.city, a.country FROM employee e INNER JOIN address a ON e.id_Address=a.id_Address WHERE e.id_Employee=$1";
const queryStringSelectCampWithId = "SELECT c.id_Camp, c.id_Address, c.name, c.id_Leader, a.addressLine1, a.addressLine2, a.postCode, a.city, a.country FROM camp c INNER JOIN address a ON c.id_Address=a.id_Address WHERE c.id_Camp=$1";
const queryStringSelectEmployeeWithEmail = "SELECT id_Employee, forename, surname, TO_CHAR(dateOfBirth, 'DD.MM.YYYY') AS dateofbirth, id_Address, svn, uid, bankAccountNumber, email, phoneNumber FROM employee WHERE email=$1";
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

const client2=new Client({
    user: 'postgres',
    password: 'plonig',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
})

const pool=new Pool();

/* #region connection functions */
function _connectToDatabase(){
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
function _insertAddress(address){
    pool.connect((err, client, done) => {
        const shouldAbort = err => {
          if (err) {
            console.error('Error in transaction', err.stack)
            client.query('ROLLBACK', err => {
              if (err) {
                console.error('Error rolling back client', err.stack)
              }
              done()
            })
          }
          return !!err
        }

        client.query('BEGIN', err => {
          if (shouldAbort(err)) return
            client.query(queryStringInsertAddress, [address.addressLine1, address.addressLine2, address.postCode, address.city, address.country], (err, res) => {
          })
        })
      });
}

function _insertAddress2(address){
    return new Promise((resolve, reject)=>{
        if(isEmptyObject(address)){
            reject(global.errorMessages.ERROR_INSERT_ADDRESS_MISSING_DATA);
        }

        client.query(queryStringInsertAddress, [address.addressLine1, address.addressLine2, address.postCode, address.city, address.country])
            .then(()=>{
                resolve(global.successMessages.SUCCESS_INSERT_ADDRESS);
            })
            .catch((error)=>{
                reject(error);
            });
    });
}
/* #endregion */

/* #region employee functions */
function _getAllEmployees(){
    return new Promise((resolve, reject)=>{
        pool.connect()
            .then((client, done)=>{

            })
            .catch()


        client.query(queryStringSelectAllEmployees)
            .then((result)=>{
                if(result.rows.length==0){
                    reject(global.errorMessages.ERROR_NO_DATA_FOUND);
                }

                resolve(result.rows);
            })
            .catch((error)=>{
                reject(error);
            });
    });
}

function _getEmployeeWithId(id_Employee){
    return new Promise((resolve, reject)=>{
        if(id_Employee==undefined){
            reject('empty');
        }

        client.query(queryStringSelectEmployeeWithId, [id_Employee])
            .then((result)=>{
                if(result.rows.length==0){
                    reject(global.errorMessages.ERROR_NO_DATA_FOUND);
                }

                resolve(result.rows);
            })
            .catch((error)=>{
                reject(error);
            })
    });
}

function _getEmployeeWithEmail(email){
    return new Promise((resolve, reject)=>{
        if(email=='' || email==undefined){
            reject(global.errorMessages.ERROR_EMPTY_STRING_OF_EMAIL);
        }

        client.query(queryStringSelectEmployeeWithEmail, [email])
            .then((result)=>{
                if(result.rows.length==0){
                    reject(global.errorMessages.ERROR_NO_DATA_FOUND);
                }

                resolve(new Employee(result.rows[0].id_employee, result.rows[0].forename, result.rows[0].surname, result.rows[0].dateofbirth, result.rows[0].id_address, result.rows[0].svn, result.rows[0].uid, result.rows[0].bankaccountnumber, result.rows[0].email, result.rows[0].phonenumber));
            })
            .catch((error)=>{
                reject(error);
            })
    });
}

function _insertEmployee(employee){
    return new Promise((resolve, reject)=>{
        if(isEmptyObject(employee)){
            reject(global.errorMessages.ERROR_INSERT_EMPLOYEE_MISSING_DATA);
        }

        client.query(queryStringInsertAddress, [employee.addressLine1, employee.addressLine2, employee.postCode, employee.city, employee.country])
            .then((result)=> {
                client.query(queryStringInsertEmployee, [employee.forename, employee.surname, employee.dateOfBirth, result.rows[0].id_address, employee.svn, employee.uid, employee.bankAccountNumber, employee.email, employee.phoneNumber])
                    .then(()=>{
                        resolve(global.successMessages.SUCCESS_INSERT_EMPLOYEE);
                    })
                    .catch((error)=>{
                        reject(error);
                    })
            })
            .catch((error)=>{
                reject(error);
            })
    });

}

function _deleteEmployee(id_Employee, id_Camp){
    return new Promise((resolve, reject)=>{
        if(id_Employee==undefined || id_Camp==undefined){
            reject(global.errorMessages.ERROR_DELETE_EMPLOYEE_MISSING_DATA);
        }

        client.query(queryStringUpdateCampLeader, [null, id_Camp, id_Employee])
            .then(()=>{
                client.query(queryStringDeleteWorksInWithIdEmployee, [id_Employee])
                    .then(()=>{
                        client.query(queryStringDeleteEmployeeWithId, [id_Employee])
                            .then(()=>{
                                resolve(global.successMessages.SUCCESS_DELETE_EMPLOYEE);
                            })
                            .catch((error)=>{
                                reject(error);
                            });
                    })
                    .catch((error)=>{
                        reject(error);
                    });
            })
            .catch((error)=>{
                reject(error);
            });
    });
}

function _updateEmployee(id_Employee, employee){
    return new Promise((resolve, reject)=>{
        if(id_Employee==undefined, isEmptyObject(employee)){
            reject(global.errorMessages.ERROR_UPDATE_EMPLOYEE_MISSING_DATA);
        }

        client.query(queryStringUpdateAddress, [employee.addressLine1, employee.addressLine2, employee.postCode, employee.city, employee.country, employee.id_Address])
            .then(()=>{
                client.query(queryStringUpdateEmployee, [employee.forename, employee.surname, employee.dateOfBirth, employee.svn, employee.uid, employee.bankAccountNumber, employee.email, employee.phoneNumber, id_Employee])
                    .then(()=>{
                        resolve(global.successMessages.SUCCESS_UPDATE_EMPLOYEE);
                    })
                    .catch((error)=>{
                        reject(error);
                    });
            })
            .catch((error)=>{
                reject(error);
            });
    });
}
/* #endregion */

/* #region camp functions */
function _getAllCamps(){
    return new Promise((resolve, reject)=>{
        client.query(queryStringSelectAllCamps)
            .then((result)=>{
                resolve(result.rows);
            })
            .catch((error)=>{
                reject(error);
            });
    });
}

async function _getCampWithId(id_Camp){
    return new Promise((resolve, reject)=>{
        client.query(queryStringSelectCampWithId, [id_Camp])
            .then((result)=>{
                resolve(result.rows);
            })
            .catch((error)=>{
                reject(error);
            });
    });
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
  
function isEmptyObject(obj) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }

    return true;
}

function shouldAbort(err){
    if(err){
        console.error('Error in transaction', err.stack);
        client.query('ROLLBACK')
            .then(()=>{
                done();
            })
            .catch((err)=>{
                console.error('Error rolling back client', err.stack);
            });
    }

    return !!err;
}

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