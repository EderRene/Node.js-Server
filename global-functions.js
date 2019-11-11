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
    SUCCESS_DATABASE_CONNECTION_CREATED: 'Database connection could have been established'
}

var errorMessages={
    ERROR_DATABASE_CONNECTION_FAILURE: 'ERROR: Database connection could not have been established',
    ERROR_DATABASE_CONNECTION_LOST: 'ERROR: Database connection lost',
    
    ERROR_EMPTY_STRING_OF_EMAIL: 'ERROR: String of email was empty',
    ERROR_NO_DATA_FOUND: 'ERROR: No data could be found in database'
}

global.successMessages=successMessages;
global.errorMessages=errorMessages;