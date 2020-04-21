const {Readable} = require('stream');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const connectionStringMongo = 'mongodb://localhost:27017/WorkingTimeManagement';
const client = new MongoClient(connectionStringMongo);
const collectionWorkingHours = 'WorkingHours';
const collectionHoliday = 'Holiday';
const collectionEmployeeFiles = 'EmployeeFiles';
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

/* #region holiday functions*/
function _getHolidaysWithId(id_Employee){
    return new Promise((resolve, reject)=>{
        client.connect()
            .then((database)=>{
                database.db(databaseWorkingTimeManagement).collection(collectionHoliday).findOne({'id_Employee': parseInt(id_Employee)}).toArray()
                    .then(()=>{
                        resolve({'statusCode': 200, 'values': {}});
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

function _insertHoliday(holiday){
    return new Promise((resolve, reject)=>{
        client.connect()
            .then((database)=>{
                database.db(databaseWorkingTimeManagement).collection(collectionHoliday).insertOne(holiday)
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
            });
    });
}

function _updateHolidayState(id_Employee, id_Holiday, state){
    return new Promise((resolve, reject)=>{
        client.connect()
            .then((database)=>{
                database.db(databaseWorkingTimeManagement).collection(collectionHoliday).updateOne({'id_Employee': parseInt(id_Employee), 'id_Holiday': id_Holiday}, {$set: {'state': state}})
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
function _getEmployeeFiles(id_Employee){

}

function _insertEmployeeFiles(database, id_Employee, id_File){
    database.db(databaseWorkingTimeManagement).collection(collectionEmployeeFiles).insertOne({'id_Employee': id_Employee, 'id_File': id_File})
        .catch((error)=>{
            error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
            throw error;
        });
}

function _getFileWithId(id_Employee){
    return new Promise((resolve, reject)=>{
        client.connect()
            .then((database)=>{
                res.set('content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                res.set('accept-ranges', 'bytes');
                
                let bucket = new mongodb.GridFSBucket(database.db(), {
                    bucketName: 'files'
                });
                
                 let downloadStream = bucket.openDownloadStream(trackID);
                
                downloadStream.on('data', (chunk) => {
                    res.write(chunk);
                });
                
                downloadStream.on('error', () => {
                    res.sendStatus(404);
                });
                
                downloadStream.on('end', () => {
                    res.end();
                }); 
            })
            .catch((error)=>{
                error.statusCode=500;
                error.message=global.errorMessages.ERROR_DATABASE_CONNECTION_FAILURE;
                reject(error);
            })
    });
}

function _insertFile(file){
    return new Promise((resolve, reject)=>{     
        const session = client.startSession();
        
        try{
            const transactionResults=session.withTransaction(async ()=>{
                const readableTrackStream = new Readable();
                readableTrackStream.push(file.data);
                readableTrackStream.push(null);
            
                let bucket = new mongodb.GridFSBucket(client.db(), {
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
            });

            if(transactionResults){
                resolve({'statusCode': 201, 'values': {}});
            } else {
                let error;
                error.statusCode=500;
                error.message='The transaction was aborded';
                reject(error);
            }
        } catch(error){
            error.statusCode=500;
            error.message='The transaction was aborded due to an unexcepted error';
            reject(error);
        } finally {
            session.endSession();
        }
    });
}

function _insertFile2(file){
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
module.exports.getHolidaysWithId=_getHolidaysWithId;
module.exports.insertHoliday=_insertHoliday;
module.exports.updateHolidayState=_updateHolidayState;
module.exports.insertFile=_insertFile;