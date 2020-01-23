const MongoClient = require('mongodb').MongoClient;
const connectionStringMongo = 'mongodb://salcher.synology.me:27017/WorkingTimeManagement';
const client = new MongoClient(connectionStringMongo);
const collectionWorkingHours = 'workingHours';
const databaseWorkingTimeManagement = 'WorkingTimeManagement';

function _insertWorkingHours(workingHours){
    return new Promise((resolve, reject)=>{
        client.connect()
            .then((database)=>{
                databaseObj=database.db(databaseWorkingTimeManagement);
                databaseObj.collection(collectionWorkingHours)
                    .then(()=>{
                        resolve({'statusCode': 201, 'values': {}});
                    })
                    .catch((error)=>{
                        error.statusCode=500;
                        error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    })
            })
            .catch((error)=>{
                error.statusCode=500;
                error.message=global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            })
    });
}

module.exports.insertWorkingHours=_insertWorkingHours;