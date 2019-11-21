'use strict';

const { Pool } = require('pg');
const queryStringSelectAllEmployees = "SELECT e.id_Employee, e.forename, e.surname, TO_CHAR(e.dateOfBirth, 'DD.MM.YYYY'), e.id_Address, e.svn, e.uid, e.bankAccountNumber, e.email, e.phoneNumber, a.addressLine1, a.addressLine2, a.postCode, a.city, a.country FROM employee e INNER JOIN address a ON e.id_Address=a.id_Address";
const queryStringSelectAllCamps = "SELECT c.id_Camp, c.id_Address, c.name, c.id_Leader, a.addressLine1, a.addressLine2, a.postCode, a.city, a.country FROM camp c INNER JOIN address a ON c.id_Address=a.id_Address";
const queryStringSelectAllDocumentTypes = "SELECT id_DocumentType, type FROM documentType";
const queryStringSelectEmployeeWithId = "SELECT e.id_Employee, e.forename, e.surname, TO_CHAR(e.dateOfBirth, 'DD.MM.YYYY'), e.id_Address, e.svn, e.uid, e.bankAccountNumber, e.email, e.phoneNumber, a.addressLine1, a.addressLine2, a.postCode, a.city, a.country FROM employee e INNER JOIN address a ON e.id_Address=a.id_Address WHERE e.id_Employee=$1";
const queryStringSelectCampWithId = "SELECT c.id_Camp, c.id_Address, c.name, c.id_Leader, a.addressLine1, a.addressLine2, a.postCode, a.city, a.country FROM camp c INNER JOIN address a ON c.id_Address=a.id_Address WHERE c.id_Camp=$1";
const queryStringSelectEmployeeWithEmail = "SELECT id_Employee, forename, surname, TO_CHAR(dateOfBirth, 'DD.MM.YYYY') AS dateofbirth, id_Address, svn, uid, bankAccountNumber, email, phoneNumber FROM employee WHERE email=$1";
const queryStringInsertAddress = "INSERT INTO address VALUES(DEFAULT, $1, $2, $3, $4, $5) RETURNING id_Address";
const queryStringInsertEmployee = "INSERT INTO employee VALUES(DEFAULT, $1, $2, TO_DATE($3, 'DD.MM.YYYY'), $4, $5, $6, $7, $8, $9) RETURNING id_Employee";
const queryStringInsertCamp = 'INSERT INTO camp VALUES(DEFAULT, $1, $2, $3) RETURNING id_Camp';
const queryStringInsertDocumentType = "INSERT INTO documentType VALUES(DEFAULT, $1)";
const queryStringUpdateEmployee = "UPDATE employee SET forename=$1, surname=$2, dateOfBirth=$3, svn=$4, uid=$5, bankAccountNumber=$6, email=$7, phoneNumber=$8 WHERE id_Employee=$9";
const queryStringUpdateAddress = "UPDATE address SET addressLine1=$1, addressLine2=$2, postCode=$3, city=$4, country=$5 WHERE id_Address=$6";
const queryStringUpdateCamp = "UPDATE camp SET name=$1 id_Leader=$2 WHERE id_Camp=$3";
const queryStringUpdateCampLeader = "UPDATE camp SET id_Leader=$1 WHERE id_Camp=$2 AND id_Leader=$3";
const queryStringDeleteEmployeeWithId = "DELETE FROM employee WHERE id_Employee=$1";
const queryStringDeleteCampWithId = "DELETE FROM camp WHERE id_Camp=$1";
const queryStringDeleteWorksInWithIdEmployee = "DELETE FROM worksIn WHERE id_Employee=$1";
const queryStringDeleteWorksInWithIdCamp = "DELETE FROM worksIn WHERE id_Camp=$1";
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
async function _getAllEmployees() {
    try {
        const client = await pool.connect();

        try {
            return (await client.query(queryStringSelectAllEmployees)).rows;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        throw error;
    }
}

async function _getEmployeeWithId(id_Employee) {
    try {
        const client = await pool.connect();

        try {
            return (await client.query(queryStringSelectEmployeeWithId, [id_Employee])).rows;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        throw error;
    }
}

async function _getEmployeeWithEmail(email) {
    try {
        const client = await pool.connect();

        try {
            let result = await client.query(queryStringSelectEmployeeWithEmail, [email]);
            return new Employee(result.rows[0].id_employee, result.rows[0].forename, result.rows[0].surname, result.rows[0].dateofbirth, result.rows[0].id_address, result.rows[0].svn, result.rows[0].uid, result.rows[0].bankaccountnumber, result.rows[0].email, result.rows[0].phonenumber);
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        throw error;
    }
}

async function _insertEmployee(employee) {
    try {
        if (isEmptyObject(employee)) {
            throw new ErrorMessage(global.errorMessages.ERROR_EMPLOYEE_MISSING_DATA);
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            var newDate = new Date(employee.dateOfBirth);
            var dateString = newDate.getDay() + "." + newDate.getMonth() + "." + newDate.getFullYear();

            let resultAddress = await client.query(queryStringInsertAddress, [employee.addressLine1, employee.addressLine2, employee.postCode, employee.city, employee.country]);
            let resultEmployee = await client.query(queryStringInsertEmployee, [employee.forename, employee.surname, dateString, resultAddress.rows[0].id_address, employee.svn, employee.uid, employee.bankAccountNumber, employee.email, employee.phonenumber]);
            await client.query('COMMIT');
            return resultEmployee.rows[0].id_employee;
        } catch (error) {
            await client.erroquery('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        throw error;
    }
}

async function _deleteEmployee(id_Employee, id_Camp) {
    try {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            await client.query(queryStringUpdateCampLeader, [null, id_Camp, id_Employee]);
            await client.query(queryStringDeleteWorksInWithIdEmployee, [id_Employee]);
            await client.query(queryStringDeleteEmployeeWithId, [id_Employee]);
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        throw error;
    }
}

async function _updateEmployee(id_Employee, employee) {
    try {
        if (isEmptyObject(employee)) {
            throw error;
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            await client.query(queryStringUpdateAddress, [employee.addressLine1, employee.addressLine2, employee.postCode, employee.city, employee.country, employee.id_Address])
            await client.query(queryStringUpdateEmployee, [employee.forename, employee.surname, employee.dateOfBirth, employee.svn, employee.uid, employee.bankAccountNumber, employee.email, employee.phoneNumber, id_Employee])
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        throw error;
    }
}
/* #endregion */

/* #region camp functions */
async function _getAllCamps() {
    try {
        const client = await pool.connect();

        try {
            return (await client.query(queryStringSelectAllCamps)).rows;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        throw error;
    }
}

async function _getCampWithId(id_Camp) {
    try {
        const client = await pool.connect();

        try {
            return (await client.query(queryStringSelectCampWithId, [id_Camp])).rows;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        throw error;
    }
}

async function _insertCamp(camp) {
    try {
        if (isEmptyObject(camp)) {
            throw new Error();
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            let resultAddress = await client.query(queryStringInsertAddress, [camp.addressLine1, camp.addressLine2, camp.postCode, camp.city, camp.country]);
            let resultCamp = await client.query(queryStringInsertCamp, [resultAddress.rows[0].id_address, camp.name, camp.id_Leader]);
            await client.query('COMMIT');
            return new SuccessMessage(global.successMessages.SUCCESS_INSERT_CAMP, { 'id_Address': resultAddress.rows[0].id_address, 'id_Employee': resultCamp.rows[0].id_camp });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        throw error;
    }
}

async function _deleteCamp(id_Camp) {
    try {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            await client.query(queryStringDeleteWorksInWithIdCamp, [id_Camp]);
            await client.query(queryStringDeleteCampWithId, [id_Camp]);
            await client.query('COMMIT');
            return new SuccessMessage(global.successMessages.SUCCESS_DELETE_CAMP);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new ErrorMessage('ERROR');
        } finally {
            client.release();
        }
    } catch (error) {
        throw error;
    }
}

async function _updateCamp(id_Camp, camp) {
    try {
        const client = await pool.connect();

        try {
            if (isEmptyObject(camp)) {
                throw new ErrorMessage('ERROR');
            }

            await client.query('BEGIN');
            await client.query(queryStringUpdateAddress, [camp.addressLine1, camp.addressLine2, camp.postCode, camp.city, camp.country, camp.id_Address])
            await client.query(queryStringUpdateCamp, [camp.name, camp.id_Leader]);
            await client.query('COMMIT');
            return new SuccessMessage(global.successMessages.SUCCESS_UPDATE_CAMP);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new ErrorMessage('ERROR');
        } finally {
            client.release();
        }
    } catch (error) {
        throw error;
    }
}
/* #endregion */

/* #region documentType functions */
async function _getAllDocumentTypes() {
    try {
        let result = await client.query(queryStringSelectAllDocumentTypes);
        return result.rows;
    } catch (err) {
        throw new Error('Something unexpected happened: ' + err);
    }
}

async function _insertDocumentType(documentType) {
    try {
        await client.query(queryStringInsertDocumentType, [documentType.type]);
        return 'Insert of documentType was successful';
    } catch (err) {
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

module.exports.getAllEmployees = _getAllEmployees;
module.exports.getAllCamps = _getAllCamps;
module.exports.getAllDocumentTypes = _getAllDocumentTypes;
module.exports.getEmployeeWithId = _getEmployeeWithId;
module.exports.getCampWithId = _getCampWithId;
module.exports.getEmployeeWithEmail = _getEmployeeWithEmail;
module.exports.insertEmployee = _insertEmployee;
module.exports.insertCamp = _insertCamp;
module.exports.insertDocumentType = _insertDocumentType;
module.exports.deleteEmployee = _deleteEmployee;
module.exports.deleteCamp = _deleteCamp;
module.exports.updateEmployee = _updateEmployee;
module.exports.updateCamp = _updateCamp;