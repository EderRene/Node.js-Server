'use strict';

const { Pool } = require('pg');
const queryStringSelectAllEmployees = "SELECT e.id_employee, e.forename, e.surname, e.dateofbirth, e.id_address, e.svn, e.uid, e.bankaccountnumber , e.email, e.phonenumber, a.addressline1, a.addressline2, a.postcode, a.city, a.country FROM employee e INNER JOIN address a ON e.id_Address=a.id_Address";
const queryStringSelectAllCamps = "SELECT c.id_camp, c.id_address, c.name, c.id_leader, e.forename, e.surname, a.addressline1, a.addressline2, a.postcode, a.city, a.country FROM camp c INNER JOIN address a ON c.id_Address=a.id_Address INNER JOIN employee e ON e.id_Employee=c.id_Leader";
const queryStringSelectAllDocumentTypes = "SELECT id_documenttype, type FROM documentType";
const queryStringSelectAllNews = "SELECT id_News, id_Employee, TO_CHAR(dateTime, 'DD.MM.YYYY/HH24:MI') AS dateTime, infoHeader, info FROM news";
const queryStringSelectEmployeeWithId = "SELECT e.id_employee, e.forename, e.surname, e.dateofbirth, e.id_address, e.svn, e.uid, e.bankaccountnumber, e.email, e.phonenumber, a.addressline1, a.addressline2, a.postcode, a.city, a.country FROM employee e INNER JOIN address a ON e.id_Address=a.id_Address WHERE e.id_employee=$1";
const queryStringSelectCampWithId = "SELECT c.id_camp, c.id_address, c.name, c.id_leader, e.forename, e.surname, a.addressline1, a.addressline2, a.postcode, a.city, a.country FROM camp c INNER JOIN address a ON c.id_Address=a.id_Address INNER JOIN employee e ON e.id_Employee=c.id_Leader WHERE c.id_camp=$1";
const queryStringSelectEmployeeWithEmail = "SELECT id_employee, forename, surname, TO_CHAR(dateOfBirth, 'DD.MM.YYYY') AS dateofbirth, id_address, svn, uid, bankaccountnumber, email, phonenumber FROM employee WHERE email=$1";
const queryStringInsertAddress = "INSERT INTO address VALUES(DEFAULT, $1, $2, $3, $4, $5) RETURNING id_address";
const queryStringInsertEmployee = "INSERT INTO employee VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_employee";
const queryStringInsertDocumentType = "INSERT INTO documentType VALUES(DEFAULT, $1) RETURNING id_documentType";
const queryStringInsertCamp = 'INSERT INTO camp VALUES(DEFAULT, $1, $2, $3) RETURNING id_camp';
const queryStringInsertNews = 'INSERT INTO news VALUES(DEFAULT, $1, $2, $3, $4) RETURNING id_news';
const queryStringUpdateEmployee = "UPDATE employee SET forename=$1, surname=$2, dateofbirth=$3, svn=$4, uid=$5, bankaccountnumber=$6, email=$7, phonenumber=$8 WHERE id_employee=$9";
const queryStringUpdateAddress = "UPDATE address SET addressline1=$1, addressline2=$2, postcode=$3, city=$4, country=$5 WHERE id_address=$6";
const queryStringUpdateCamp = "UPDATE camp SET name=$1, id_Leader=$2 WHERE id_camp=$3";
const queryStringUpdateCampLeader = "UPDATE camp SET id_leader=$1 WHERE id_camp=$2 AND id_leader=$3";
const queryStringDeleteEmployeeWithId = "DELETE FROM employee WHERE id_employee=$1";
const queryStringDeleteCampWithId = "DELETE FROM camp WHERE id_camp=$1";
const queryStringDeleteWorksInWithIdEmployee = "DELETE FROM worksIn WHERE id_employee=$1";
const queryStringDeleteWorksInWithIdCamp = "DELETE FROM worksIn WHERE id_camp=$1";
const queryStringDeleteNewsWithId = "DELETE FROM news WHERE id_news=$1";

var Employee = require('./dataModels/employee.js');
var Address = require('./dataModels/address.js');
var Camp = require('./dataModels/camp.js');
var SuccessMessage = require('./dataModels/successMessage.js');
var ErrorMessage = require('./dataModels/errorMessage.js');

var pool = new Pool({
    database: 'zeitverwaltung',
    user: 'plonig',
    password: 'plonig',
    host: 'salcher.synology.me',
    port: 5432,
    ssl: false,
});

const pool2 = new Pool({
    database: 'postgres',
    host: 'localhost',
    user: 'postgres',
    password: 'plonig',
    port: 5432,
});

const pool3 = new Pool({
    database: 'zeitverwaltung',
    host: 'postgres',
    user: 'plonig',
    password: 'plonig',
    port: 5432,
});

/* #region employee functions */
function _getAllEmployees() {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then((client) => {
                client.query(queryStringSelectAllEmployees)
                    .then((result) => {
                        let response = { 'statusCode': 200, 'values': result.rows };
                        resolve(response);
                    })
                    .catch((error) => {
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    });
            })
            .catch((error) => {
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            })
    });
}

function _getEmployeeWithId(id_Employee) {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then((client) => {
                client.query(queryStringSelectEmployeeWithId, [id_Employee])
                    .then((result) => {
                        if (result.rows.length == 0) {
                            let error = { 'statusCode': 404, 'message': global.errorMessages.ERROR_DATABASE_QUERY_NO_DATA_FOUND };
                            reject(error);
                        }

                        let response = { 'statusCode': 200, 'values': result.rows };
                        resolve(response);
                    })
                    .catch((error) => {
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    })
            })
            .catch((error) => {
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            });
    });
}

function _getEmployeeWithEmail(email) {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then((client) => {
                client.query(queryStringSelectEmployeeWithEmail, [email])
                    .then((result) => {
                        resolve(new Employee(result.rows[0].id_employee, result.rows[0].forename, result.rows[0].surname, result.rows[0].dateofbirth, result.rows[0].id_address, result.rows[0].svn, result.rows[0].uid, result.rows[0].bankaccountnumber, result.rows[0].email, result.rows[0].phonenumber));
                    })
                    .catch((error) => {
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    })
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function _insertEmployee(employee) {
    return new Promise((resolve, reject) => {
        if (isEmptyObject(employee)) {
            reject(global.errorMessages.ERROR_EMPLOYEE_MISSING_DATA);
        }

        var resultAddress;
        var resultEmployee;

        pool.connect()
            .then((client) => {
                client.query('BEGIN')
                    .then(() => {
                        return client.query(queryStringInsertAddress, [employee.addressLine1, employee.addressLine2, employee.postCode, employee.city, employee.country]);
                    })
                    .then((result) => {
                        resultAddress = result;
                        return client.query(queryStringInsertEmployee, [employee.forename, employee.surname, employee.dateOfBirth, resultAddress.rows[0].id_address, employee.svn, employee.uid, employee.bankAccountNumber, employee.email, employee.phonenumber]);
                    })
                    .then((result) => {
                        resultEmployee = result;
                        return client.query('COMMIT');
                    })
                    .then(() => {
                        resolve({ 'statusCode': 201, 'values': { 'id_Employee': resultEmployee.rows[0].id_employee, 'id_Address:': resultAddress.rows[0].id_address } });
                    })
                    .catch((error) => {
                        rollbackDatabase(client);
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    });
            })
            .catch((error) => {
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            });
    });
}

function _deleteEmployee(id_Employee, id_Camp) {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then((client) => {
                client.query('BEGIN')
                    .then(() => {
                        return client.query(queryStringUpdateCampLeader, [null, id_Camp, id_Employee]);
                    })
                    .then(() => {
                        return client.query(queryStringDeleteWorksInWithIdEmployee, [id_Employee]);
                    })
                    .then(() => {
                        return client.query(queryStringDeleteEmployeeWithId, [id_Employee]);
                    })
                    .then(() => {
                        return client.query('COMMIT');
                    })
                    .then(() => {
                        resolve({ 'statusCode': 204 });
                    })
                    .catch((error) => {
                        rollbackDatabase(client);
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    });
            })
            .catch((error) => {
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            });
    });
}

async function _updateEmployee(id_Employee, employee) {
    return new Promise((resolve, reject) => {
        if (isEmptyObject(employee)) {
            reject(global.errorMessages.ERROR_EMPLOYEE_MISSING_DATA)
        }

        pool.connect()
            .then((client) => {
                client.query('BEGIN')
                    .then(() => {
                        return client.query(queryStringUpdateAddress, [employee.addressline1, employee.addressline2, employee.postcode, employee.city, employee.country, employee.id_Address]);
                    })
                    .then(() => {
                        return client.query(queryStringUpdateEmployee, [employee.forename, employee.surname, employee.dateofbirth, employee.svn, employee.uid, employee.bankaccountnumber, employee.email, employee.phonenumber, id_Employee]);
                    })
                    .then(() => {
                        return client.query('COMMIT');
                    })
                    .then(() => {
                        resolve({ 'statusCode': 204 });
                    })
                    .catch((error) => {
                        rollbackDatabase(client);
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    });
            })
            .catch((error) => {
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            });
    });
}
/* #endregion */

/* #region camp functions */
function _getAllCamps() {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then((client) => {
                client.query(queryStringSelectAllCamps)
                    .then((result) => {
                        resolve({ 'statusCode': 200, 'values': result.rows });
                    })
                    .catch((error) => {
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    })
            })
            .catch((error) => {
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            });
    });
}

function _getCampWithId(id_Camp) {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then((client) => {
                client.query(queryStringSelectCampWithId, [id_Camp])
                    .then((result) => {
                        resolve({ 'statusCode': 200, 'values': result.rows });
                    })
                    .catch((error) => {
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    })
            })
            .catch((error) => {
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            });
    })
}

function _insertCamp(camp) {
    return new Promise((resolve, reject) => {
        if (isEmptyObject(camp)) {
            reject(global.errorMessages.ERROR_CAMP_MISSING_DATA);
        }

        var resultAddress;
        var resultCamp;

        pool.connect()
            .then((client) => {
                client.query('BEGIN')
                    .then(() => {
                        return client.query(queryStringInsertAddress, [camp.addressLine1, camp.addressLine2, camp.postCode, camp.city, camp.country]);
                    })
                    .then((result) => {
                        resultAddress = result;
                        return client.query(queryStringInsertCamp, [resultAddress.rows[0].id_address, camp.name, parseInt(camp.id_Leader, 10)]);
                    })
                    .then((result) => {
                        resultCamp = result;
                        return client.query('COMMIT');
                    })
                    .then(() => {
                        resolve({ 'statusCode': 201, 'values': { 'id_Address': resultAddress.rows[0].id_address, 'id_Camp': resultCamp.rows[0].id_camp } });
                    })
                    .catch((error) => {
                        rollbackDatabase(client);
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    })
            })
            .catch((error) => {
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            })
    });
}

function _deleteCamp(id_Camp) {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then((client) => {
                client.query('BEGIN')
                    .then(() => {
                        return client.query(queryStringDeleteWorksInWithIdCamp, [id_Camp]);
                    })
                    .then(() => {
                        return client.query(queryStringDeleteCampWithId, [id_Camp]);
                    })
                    .then(() => {
                        return client.query('COMMIT');
                    })
                    .then(() => {
                        resolve({ 'statusCode': 204 });
                    })
                    .catch((error) => {
                        rollbackDatabase(client);
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    });
            })
            .catch((error) => {
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            });
    });
}

function _updateCamp(id_Camp, camp) {
    return new Promise((resolve, reject) => {
        if (isEmptyObject(camp)) {
            reject(global.errorMessages.ERROR_CAMP_MISSING_DATA);
        }

        pool.connect()
            .then((client) => {
                client.query('BEGIN')
                    .then(() => {
                        return client.query(queryStringUpdateAddress, [camp.addressline1, camp.addressline2, camp.postcode, camp.city, camp.country, camp.id_address]);
                    })
                    .then(() => {
                        return client.query(queryStringUpdateCamp, [camp.name, parseInt(camp.id_leader, 10), id_Camp]);
                    })
                    .then(() => {
                        return client.query('COMMIT');
                    })
                    .then(() => {
                        resolve({ 'statusCode': 204 });
                    })
                    .catch((error) => {
                        rollbackDatabase(client);
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    })
            })
            .catch((error) => {
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            });
    });
}
/* #endregion */

/* #region documentType functions */
function _getAllDocumentTypes() {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then((client) => {
                client.query(queryStringSelectAllDocumentTypes)
                    .then((result) => {
                        resolve({ 'statusCode': 200, 'values': result.rows });
                    })
                    .catch((error) => {
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    });
            })
            .catch((error) => {
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            });
    });
}

function _insertDocumentType(documentType) {
    return new Promise((resolve, reject) => {
        var resultDocumentType;

        pool.connect()
            .then((client) => {
                client.query('BEGIN')
                    .then(() => {
                        return client.query(queryStringInsertDocumentType, [documentType.type]);
                    })
                    .then((result) => {
                        resultDocumentType = result;
                        return client.query('COMMIT');
                    })
                    .then(() => {
                        resolve({ 'statusCode': 201, 'values': { 'id_documentType': resultDocumentType.rows[0].id_documenttype } })
                    })
                    .catch((error) => {
                        rollbackDatabase(client);
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    });
            })
            .catch((error) => {
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            });
    });
}

/* #endregion */

/* #region news functions */
function _getAllNews(){
    return new Promise((resolve, reject) => {
        pool.connect()
            .then((client) => {
                client.query(queryStringSelectAllNews)
                    .then((result) => {
                        resolve({ 'statusCode': 200, 'values': result.rows });
                    })
                    .catch((error) => {
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(() => {
                        client.release();
                    });
            })
            .catch((error) => {
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            })
    });
}

function _insertNews(news){
    return new Promise((resolve, reject) => {
        var resultNews;

        if (isEmptyObject(news)) {
            reject(global.errorMessages.ERROR_EMPLOYEE_MISSING_DATA);
        }

        pool.connect()
            .then((client)=>{
                client.query('BEGIN')
                    .then(()=>{
                        return client.query(queryStringInsertNews, [news.id_Employee, new Date(Date.now()), news.infoHeader, news.info]);
                    })
                    .then((result)=>{
                        resultNews=result;
                        return client.query('COMMIT');
                    })
                    .then(()=>{
                        resolve({ 'statusCode': 201, 'values': { 'id_news': resultNews.rows[0].id_news } })
                    })
                    .catch((error)=>{
                        rollbackDatabase(client);
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(()=>{
                        client.release();
                    });
            })
            .catch((error)=>{
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            });
    });
}

function _deleteNews(id_News){
    return new Promise((resolve, reject)=>{
        pool.connect()
            .then((client)=>{
                client.query('BEGIN')
                    .then(()=>{
                        return client.query(queryStringDeleteNewsWithId, [id_News]);
                    })
                    .then(()=>{
                        return client.query('COMMIT');
                    })
                    .then(()=>{
                        resolve({ 'statusCode': 204, 'values': {}});
                    })
                    .catch((error)=>{
                        rollbackDatabase(client);
                        error.statusCode = 500;
                        error.message = global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
                    .finally(()=>{
                        client.release();
                    });
            })
            .catch((error)=>{
                error.statusCode = 500;
                error.message = global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            })
    })
}
/* #endregion */

/* #region helpful functions for database*/
function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }

    return true;
}

function rollbackDatabase(client) {
    try {
        client.query('ROLLBACK');
    } catch (error) {
        throw error;
    }
}

/* #endregion */

module.exports.getAllEmployees = _getAllEmployees;
module.exports.getAllCamps = _getAllCamps;
module.exports.getAllDocumentTypes = _getAllDocumentTypes;
module.exports.getAllNews = _getAllNews;
module.exports.getEmployeeWithId = _getEmployeeWithId;
module.exports.getCampWithId = _getCampWithId;
module.exports.getEmployeeWithEmail = _getEmployeeWithEmail;
module.exports.insertEmployee = _insertEmployee;
module.exports.insertCamp = _insertCamp;
module.exports.insertDocumentType = _insertDocumentType;
module.exports.insertNews = _insertNews;
module.exports.deleteEmployee = _deleteEmployee;
module.exports.deleteCamp = _deleteCamp;
module.exports.deleteNews = _deleteNews;
module.exports.updateEmployee = _updateEmployee;
module.exports.updateCamp = _updateCamp;