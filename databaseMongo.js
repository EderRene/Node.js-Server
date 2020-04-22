const multer = require('multer');
const {Readable} = require('stream');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const connectionStringMongo = 'mongodb://localhost:27017/WorkingTimeManagement';
const client = new MongoClient(connectionStringMongo);
const collectionWorkingHours = 'WorkingHours';
const collectionHoliday = 'Holiday';
const collectionEmployeeFiles = 'EmployeeFiles';
const collectionFiles = 'files.files';
const collectionChunks = 'files.chunks';
const databaseWorkingTimeManagement = 'WorkingTimeManagement';
const database=null;
var MongoPool = require("./mongo-pool.js");
const {ObjectId} = require('mongodb');

createUniqueIndex();
createTextIndex();

/* #region workingHours functions */
function createUniqueIndex(){
    MongoPool.getInstance((database)=>{
        database.db(databaseWorkingTimeManagement).collection(collectionWorkingHours).createIndex({'id_Employee': 1, 'workingDate': 1}, {unique: true})
        .then(()=>{
            console.log('MongoDB unique index for id_Employee and workingDate created');
        })
        .catch((error)=>{
            error.message='ERROR: Could not create MongoDB index for id_Employee and workingDate';
            throw error;
        })
    });

    MongoPool.getInstance((database)=>{
        database.db(databaseWorkingTimeManagement).collection(collectionEmployeeFiles).createIndex({'id_Employee': 1, 'filename': 1}, {unique: true})
        .then(()=>{
            console.log('MongoDB unique index for id_Employee and filename created');
        }) 
        .catch((error)=>{
            error.message='ERROR: Could not create MongoDB index for id_Employee and filename';
            throw error;
        });
    });
}

function createTextIndex(){
    MongoPool.getInstance((database)=>{
        database.db(databaseWorkingTimeManagement).collection(collectionHoliday).createIndex({'id_Employee': 1})
            .then(()=>{
                console.log('MongoDB text index for id_employee created');
            })
            .catch((error)=>{
                error.message='ERROR: Could not create MongoDB text index for id_Employee';
            });
    });
}
/* #endregion */

/* #region workingHours functions */
function _getWorkingHoursWithId(idEmployee){
    return new Promise((resolve, reject)=>{
        MongoPool.getInstance((database)=>{
            database.db(databaseWorkingTimeManagement).collection(collectionWorkingHours).find({'id_Employee': parseInt(idEmployee)}).toArray()
                .then((result)=>{
                    resolve({'statusCode': 200, 'values': result});
                })
                .catch((error)=>{
                    error.statusCode=500;
                    error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                    reject(error);
                });
        });
    })
}

function _getWorkingHoursWithIdAndSelectedDate(id_Employee, startDate, endDate){
    return new Promise((resolve, reject)=>{
        MongoPool.getInstance((database)=>{
            if(startDate==null && endDate==null){
                database.db(databaseWorkingTimeManagement).collection(collectionWorkingHours).find({'id_Employee': parseInt(id_Employee)}).toArray()
                    .then((result)=>{
                        resolve({'statusCode': 200, 'values': result});
                    })
                    .catch((error)=>{
                        error.statusCode=500;
                        error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    });
            } else {
                database.db(databaseWorkingTimeManagement).collection(collectionWorkingHours).find({'id_Employee': parseInt(id_Employee)}).toArray()
                    .then((result)=>{
                        var array=new Array();

                        for(let i=0; i<result.length; i++){
                            array.push(parseWorkingDay(result[i]));
                        }

                        console.log();
                    })
                    .catch((error)=>{
                        error.statusCode=500;
                        error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                        reject(error);
                    });
            }
        });
    });
}

function parseWorkingDate(workingDate){
    //let workingDate=56;
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
        MongoPool.getInstance((database)=>{
            database.db(databaseWorkingTimeManagement).collection(collectionHoliday).find({'id_Employee': parseInt(id_Employee)}).toArray()
                .then((result)=>{
                    resolve({'statusCode': 200, 'values': {'holidays': result}});
                })
                .catch((error)=>{
                    error.statusCode=500;
                    error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                    reject(error); 
                });
        })
    });
}

function _insertHoliday(holiday){
    return new Promise((resolve, reject)=>{
        MongoPool.getInstance((database)=>{
            database.db(databaseWorkingTimeManagement).collection(collectionHoliday).insertOne(holiday)
                .then((result)=>{
                    resolve({'statusCode': 201, 'values': {'id_Holiday': result.insertedId}});
                })
                .catch((error)=>{
                    error.statusCode=500;
                    error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                    reject(error); 
                });
        })
    });
}

function _updateHolidayState(id_Employee, id_Holiday, state){
    return new Promise((resolve, reject)=>{
        MongoPool.getInstance((database)=>{
            database.db(databaseWorkingTimeManagement).collection(collectionHoliday).updateOne({'id_Employee': parseInt(id_Employee), '_id': ObjectId(id_Holiday)}, {$set: {'state': state}})
                .then(()=>{
                    resolve({'statusCode': 204, 'values': {}});
                })
                .catch((error)=>{
                    error.statusCode=500;
                    error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                    reject(error); 
                });
        })
    });
}
/* #endregion */

/* #region file functions*/
function _getFileDetails(id_Employee){
    return new Promise((resolve, reject)=>{
        MongoPool.getInstance((database)=>{
            database.db(databaseWorkingTimeManagement).collection(collectionEmployeeFiles).find({'id_Employee': id_Employee}).toArray()
                .then((result)=>{
                    resolve(result);
                })
                .catch((error)=>{
                    error.statusCode=500;
                    error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                    reject(error); 
                })
        });
    });
}

function _getFileWithId(id_File, filename){
    return new Promise((resolve, reject)=>{
        MongoPool.getInstance((database)=>{
            database.db(databaseWorkingTimeManagement).collection(collectionChunks).find({'files_id': ObjectId(id_File)}).sort({n: 1}).toArray()
                .then((result)=>{
                    let contentType='';

                    if(filename.endsWith('txt')){
                        contentType="text/plain";
                    } else if(filename.endsWith('pdf')){
                        contentType="application/pdf";
                    } else if(filename.endsWith('docx')){
                        contentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    } else if(filename.endsWith('png')){
                        contentType="image/png";
                    } else if(filename.endsWith('jpg') || filename.endsWith('jpeg')){
                        contentType="image/jpeg"
                    }

                    let fileData=[];
                    for(let i=0; i<result.length; i++){
                        fileData.push(result[i].data.toString('base64'));
                    }

                    let returnValue="data:" + contentType + ";charset=utf-8;base64," + fileData.join() + ""; 

                    resolve({'statusCode': 200, 'values': returnValue});
                })
                .catch((error)=>{
                    error.statusCode=500;
                    error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                    reject(error); 
                });
        });
    })
}

function _insertFile(files, id_Employee){
    return new Promise(async (resolve, reject)=>{
        try{
            if(!files.length==undefined){
                let id_File=await helperFunctionInsertFile(files);
                await helperFunctionInsertEmployeeFile(id_Employee, id_File, files.name);
            } else {
                for(let i=0; i<files.length; i++){
                    let id_File=await helperFunctionInsertFile(files[i]);
                    await helperFunctionInsertEmployeeFile(id_Employee, id_File, files[i].name);
                }
            }

            resolve({'statusCode': 201, 'values': {}});
        } catch(error){
            error.statusCode=500;
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

function helperFunctionInsertEmployeeFile(id_Employee, id_File, filename){
    return new Promise((resolve, reject)=>{
        MongoPool.getInstance(function (database){
            database.db(databaseWorkingTimeManagement).collection(collectionEmployeeFiles).insertOne({'id_Employee': id_Employee, 'id_File': id_File, 'filename': filename})
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

function _deleteFileWithId(id_File){
    return new Promise((resolve, reject)=>{
        MongoPool.getInstance((database)=>{
            database.db(databaseWorkingTimeManagement).collection(collectionFiles).deleteOne({'_id': ObjectId(id_File)})
                .then(()=>{
                    database.db(databaseWorkingTimeManagement).collection(collectionChunks).deleteMany({'files_id': ObjectId(id_File)})
                        .then(()=>{
                            database.db(databaseWorkingTimeManagement).collection(collectionEmployeeFiles).deleteOne({'id_File': id_File})
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
                            error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                            reject(error); 
                        });
                })
                .catch((error)=>{
                    error.statusCode=500;
                    error.message=global.errorMessages.ERROR_DATABASE_QUERY_FAILURE;
                    reject(error); 
                });
        });
    });
}
/* #endregion */

module.exports.getWorkingHoursWithIdAndSelectedDate=_getWorkingHoursWithIdAndSelectedDate;
module.exports.insertWorkingHours=_insertWorkingHours;
module.exports.updateWorkingHours=_updateWorkingHours;
module.exports.deleteWorkingHours=_deleteWorkingHours;
module.exports.getHolidaysWithId=_getHolidaysWithId;
module.exports.insertHoliday=_insertHoliday;
module.exports.updateHolidayState=_updateHolidayState;
module.exports.insertFile=_insertFile;
module.exports.getFileDetails=_getFileDetails;
module.exports.getFileWithId=_getFileWithId;
module.exports.deleteFileWithId=_deleteFileWithId;