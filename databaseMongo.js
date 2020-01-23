const MongoClient = require('mongodb').MongoClient;
const connectionStringMongo = 'mongodb://salcher.synology.me:27017/WorkingTimeManagement';
const client = new MongoClient(connectionStringMongo);
const collectionWorkingHours = 'WorkingHours';
const databaseWorkingTimeManagement = 'WorkingTimeManagement';

_createUniqueIndex();

/* #region workingHours functions*/
function _createUniqueIndex(){
    client.connect()
        .then((database)=>{
            database.db(databaseWorkingTimeManagement).collection(collectionWorkingHours).createIndex({'id_Employee': 1, 'workingDate': 1}, {unique: true})
                .then(()=>{
                    console.log('MongoDB Index for id_Employee created');
                })
                .catch((error)=>{
                    error.message='Could not create MongoDB Index for id_Employee';
                    throw error;
                })
        })
        .catch((error)=>{
            error.message=global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
            throw error;
        })
}

function _getWorkingHoursWithId(idEmployee){
    return new Promise((resolve, reject)=>{
        client.connect()
        .then((database)=>{
            database.db(databaseWorkingTimeManagement).collection(collectionWorkingHours).find({'id_Employee': parseInt(idEmployee)}).toArray()
                .then((result)=>{
                    resolve({'statusCode': 200, 'values': result});
                })
                .catch((error)=>{
                    error.statusCode=500;
                    error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                    reject(error);
                });
        })
        .catch((error)=>{
            error.statusCode=500;
            error.message=global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
            reject(error);
        })
    })
}

function _insertWorkingHours(workingHours){
    return new Promise((resolve, reject)=>{
        client.connect()
            .then((database)=>{
                database.db(databaseWorkingTimeManagement).collection(collectionWorkingHours).insertOne(workingHours)
                    .then(()=>{
                        resolve({'statusCode': 201, 'values': {}});
                    })
                    .catch((error)=>{
                        error.statusCode=500;
                        error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    });
            })
            .catch((error)=>{
                error.statusCode=500;
                error.message=global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            })
    });
}

function _updateWorkingHours(id_Employee, workingHours){
    return new Promise((resolve, reject)=>{
        client.connect()
            .then((database)=>{
                database.db(databaseWorkingTimeManagement).collection(collectionWorkingHours).updateOne({'id_Employee': parseInt(id_Employee)}, {$set: workingHours})
                    .then(()=>{
                        resolve({'statusCode': 204, 'values': {}});
                    })
                    .catch((error)=>{
                        error.statusCode=500;
                        error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error); 
                    });
            })
            .catch((error)=>{
                error.statusCode=500;
                error.message=global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            })
    });
}

function _deleteWorkingHours(id_Employee){
    return new Promise((resolve, reject)=>{
        client.connect()
            .then((database)=>{
                database.db(databaseWorkingTimeManagement).collection(collectionWorkingHours).deleteOne({'id_Employee': parseInt(id_Employee)})
                    .then(()=>{
                        resolve({'statusCode': 204, 'values': {}});
                    })
                    .catch((error)=>{
                        error.statusCode=500;
                        error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error); 
                    });
            })
            .catch((error)=>{
                error.statusCode=500;
                error.message=global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            });
    });
}
/* #endregion */

module.exports.getWorkingHoursWithId=_getWorkingHoursWithId;
module.exports.insertWorkingHours=_insertWorkingHours;
module.exports.updateWorkingHours=_updateWorkingHours;
module.exports.deleteWorkingHours=_deleteWorkingHours;