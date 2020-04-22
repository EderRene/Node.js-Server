module.exports.centralErrorHandler = (err, req, res, next) => {
    if(err instanceof RangeError){
      res.status(404).send('Not found '+err.message);
      return;
    }
    if(err instanceof TypeError){
      res.send(400,'Bad Request'+err);
      return;
    }
    if(err instanceof Error)
    res.status(500).send('something unexpected has happend.'+ err.message);
  }

var successMessages={
    SUCCESS_DATABASE_CONNECTION_CREATED: 'SUCCESS: Database connection could have been established',
    SUCCESS_INSERT_ADDRESS: 'SUCCESS: Insert of address was successful',
    SUCCESS_INSERT_EMPLOYEE: 'SUCCESS: Insert of employee was successful',
    SUCCESS_INSERT_CAMP: 'SUCCESS: Insert of camp was successful',
    SUCCESS_DELETE_EMPLOYEE: 'SUCCESS: Delete of employee was successful',
    SUCCESS_DELETE_CAMP: 'SUCCESS: Delete of employee was successful',
    SUCCESS_UPDATE_EMPLOYEE: 'SUCCESS: Update of employee was successful',
    SUCCESS_UPDATE_CAMP: 'SUCCESS: Update of employee was successful'
}

var errorMessages={
    ERROR_DATABASE_CONNECTION_FAILURE: 'ERROR: Database connection could not have been established',
    ERROR_DATABASE_QUERY_FAILURE: 'ERROR: Database query could not have been established',
    ERROR_DATABASE_QUERY_NO_DATA_FOUND: 'ERROR: No data could be found in database',

    ERROR_EMPLOYEE_MISSING_DATA: 'ERROR: Employee data is missing',
    ERROR_CAMP_MISSING_DATA: 'ERROR: Camp data is missing',
    ERROR_EMPTY_STRING_OF_EMAIL: 'ERROR: email was empty',
    ERROR_EMPLOYEE_NO_DATA_FOUND: 'ERROR: No employee data could be found in database',
    ERROR_EMPLOYEE_SELECT_ALL_FAILED: 'ERROR: Select of employees failed',
    ERROR_EMPLOYEE_SELECT_ID_FAILED: 'ERROR: Select of employee with specific id failed',
    ERROR_EMPLOYEE_SELECT_EMAIL_FAILED: 'ERROR: Select of employee with specifi email failed',
    ERROR_EMPLOYEE_INSERT_FAILED: 'Es konnte kein neuer Mitarbeiter eingefügt werden, bitte überprüfen Sie Ihre Eingaben!',
    ERROR_EMPLOYEE_DELETE_FAILED: 'ERROR: Delete of employee failed',
    ERROR_EMPLOYEE_UPDATE_FAILED: 'ERROR: Update of employee failed',
    ERROR_EMPLOYEE_INSERT_FAILED_FILE: 'ERROR: Insert of file failed',
    ERROR_EMPLOYEE_DELETE_FAILED_FILE: 'ERROR: Delete of file failed',
    
    ERROR_MONGO_TRANSACTION: 'ERROR: Mongo transaction aborded',
    ERROR_MONGO_TRANSACTION_UNEXPECTED: 'ERROR: Mongo transaction aborded due to an unexpected error',
}

global.successMessages=successMessages;
global.errorMessages=errorMessages;