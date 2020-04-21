const {Readable} = require('stream');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const connectionStringMongo = 'mongodb://localhost:27017/WorkingTimeManagement';
const client = new MongoClient(connectionStringMongo);
const collectionWorkingHours = 'WorkingHours';
const collectionHoliday = 'Holiday';
const collectionEmployeeFiles = 'EmployeeFiles';
const databaseWorkingTimeManagement = 'WorkingTimeManagement';
const database=null;
var MongoPool = require("./mongo-pool.js");

createUniqueIndex();

/* #region workingHours functions*/
function createUniqueIndex(){
    MongoPool.getInstance(function (database){
        database.db(databaseWorkingTimeManagement).collection(collectionWorkingHours).createIndex({'id_Employee': 1, 'workingDate': 1}, {unique: true})
        .then(()=>{
            console.log('MongoDB index for id_Employee and workingDate created');
        })
        .catch((error)=>{
            error.message='ERROR: Could not create MongoDB index for id_Employee and workingDate';
            throw error;
        })
    });

    MongoPool.getInstance(function (database){
        database.db(databaseWorkingTimeManagement).collection(collectionEmployeeFiles).createIndex({'id_Employee': 1, 'filename': 1}, {unique: true})
        .then(()=>{
            console.log('MongoDB index for id_Employee and filename created');
        }) 
        .catch((error)=>{
            error.message='ERROR: Could not create MongoDB index for id_Employee and filename';
            throw error;
        });
    });
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
            });
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
            });
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
            });
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
            });
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

function _getFileWithId(id_Employee, id_File){
    return new Promise(async (resolve, reject)=>{
        try{
            let filename=await helperFunctionGetFilename(id_Employee, id_File);
            await helperFunctionGetFileWithId(filename);
            resolve({'statusCode': 200, 'values': {}});
        } catch(error){
            reject(error);
        }
    });
}

function helperFunctionGetFilename(id_Employee, id_File){
    return new Promise((resolve, reject)=>{
        MongoClient.getInstance((database)=>{
            database.db(databaseWorkingTimeManagement).collection(collectionEmployeeFiles).find({'id_Employee': id_Employee, 'id_File': id_File})
                .then((result)=>{
                    resolve(result.filename);
                })
                .catch((error)=>{
                    error.statusCode=500;
                    error.message='';
                    reject(error);
                })
        });
    });
}

function helperFunctionGetFileWithId(filename){
    return new Promise((resolve, reject)=>{
        MongoPool.getInstance((database)=>{
            res.set('content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.set('accept-ranges', 'bytes');
            
            let bucket = new mongodb.GridFSBucket(database.db(), {
                bucketName: 'files'
            });
            
            let downloadStream = bucket.openDownloadStream(trackID);
            
            downloadStream.on('data', (chunk) => {
                res.write(chunk);
            });
            
            downloadStream.on('error', (error) => {
                error.statusCode=500;
                error.message='';
                reject(error);
            });
            
            downloadStream.on('end', () => {
                res.end();
                resolve();
            }); 
        });
    });
}

function _insertFile(file, id_Employee){
    return new Promise(async (resolve, reject)=>{
        try{
            let id_File=await helperFunctionInsertFile(file);
            await helperFunctionInsertEmployeeFile(id_Employee, id_File, file.name);
            resolve({'statusCode': 201, 'values': {}});
        } catch(error){
            reject(error);
        }
    });
}

function helperFunctionInsertFile(file){
    return new Promise((resolve, reject)=>{
        MongoPool.getInstance(function (database){
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
        
            uploadStream.on('finish', (result) => {
                resolve(result._id.toString());
            });
        });
    });
}

function helperFunctionInsertEmployeeFile(id_Employee, filename){
    return new Promise((resolve, reject)=>{
        MongoPool.getInstance(function (database){
            database.db(databaseWorkingTimeManagement).collection(collectionEmployeeFiles).insertOne({'id_Employee': id_Employee, 'filename': filename})
            .then((database)=>{
                resolve();
            })
            .catch((error)=>{
                error.statusCode=500;
                error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                reject(error); 
            });
        });
    });
}

function _deleteFileWithId(id_Employee, id_File){
    return new Promise((resolve, reject)=>{
        try{

        } catch(error){
            reject(error);
        }
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