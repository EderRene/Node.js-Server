const {Readable} = require('stream');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const connectionStringMongo = 'mongodb://localhost:27017/WorkingTimeManagement';
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
                    console.log('MongoDB Index for id_Employee and workingDate created');
                })
                .catch((error)=>{
                    error.message='Could not create MongoDB Index for id_Employee and workingDate';
                    throw error;
                })
        })
        .catch((error)=>{
            error.message=global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
            throw error;
        });
}

function _createWorkingHoursProfil(id_Employee){
    var workingHours={
        'id_Employee': id_Employee
    };
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
                database.db(databaseWorkingTimeManagement).collection(collectionWorkingHours).updateOne({'id_Employee': parseInt(id_Employee)}, {$set: {'workingDate': workingHours.workingDate, 'workingHours': workingHours.workingHours}})
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

function _updateWorkingHoursWithIdAndDate(id_Employee, workingDate, workingHours){
    return new Promise((resolve, reject)=>{
        client.connect()
            .then((database)=>{
                database.db(databaseWorkingTimeManagement).collection(collectionWorkingHours).updateOne({'id_Employee': parseInt(id_Employee), 'workingDate': workingDate})
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

/* #region file functions*/
function _insertFile(file){
    return new Promise((resolve, reject)=>{
        client.connect()
            .then((database)=>{
                const readableTrackStream = new Readable();
                readableTrackStream.push(file.data);
                readableTrackStream.push(null);
            
                let bucket = new mongodb.GridFSBucket(database.db(), {
                  bucketName: 'files'
                });
            
                let uploadStream = bucket.openUploadStream(file.name);
                readableTrackStream.pipe(uploadStream);
            
                uploadStream.on('error', (error) => {
                    error.statusCode=500;
                    error.message=global.errorMessages.ERROR_EMPLOYEE_INSERT_FAILED_FILE;
                    reject(error);
                });
            
                uploadStream.on('finish', () => {
                    resolve({'statusCode': 201, 'values': {}});
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
module.exports.insertFile=_insertFile;