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
    SUCCESS_DELETE_EMPLOYEE: 'SUCCESS: Delete of employee was successful',
    SUCCESS_UPDATE_EMPLOYEE: 'SUCCESS: Update of employee was successful'
}

var errorMessages={
    ERROR_DATABASE_CONNECTION_FAILURE: 'ERROR: Database connection could not have been established',
    ERROR_DATABASE_CONNECTION_LOST: 'ERROR: Database connection lost',
    
    ERROR_EMPTY_STRING_OF_EMAIL: 'ERROR: email was empty',
    ERROR_NO_DATA_FOUND: 'ERROR: No data could be found in database',

    ERROR_INSERT_ADDRESS_MISSING_DATA: 'ERROR: Insert of address failed, data is missing',
    ERROR_INSERT_EMPLOYEE_MISSING_DATA: 'ERROR: Insert of employee failed, data is missing',
    ERROR_DELETE_EMPLOYEE_MISSING_DATA: 'ERROR: Delete of employee failed, data is missing',
    ERROR_UPDATE_EMPLOYEE_MISSING_DATA: 'ERROR: Update of employee failed, data is missing'
}

global.successMessages=successMessages;
global.errorMessages=errorMessages;