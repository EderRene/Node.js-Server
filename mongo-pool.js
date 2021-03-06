var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://salcher.synology.me:27017/WorkingTimeManagement';

var option = {
    numberOfRetries : 5, 
    auto_reconnect: true, 
    poolSize : 40, 
    connectTimeoutMS: 30000 
};

function MongoPool(){}

var p_db;

function initPool(cb){
  MongoClient.connect(url, option, function(err, db) {
    if (err) throw err;

    p_db = db;
    if(cb && typeof(cb) == 'function')
        cb(p_db);
  });
  return MongoPool;
}

MongoPool.initPool = initPool;

function getInstance(cb){
  if(!p_db){
    initPool(cb)
  }
  else{
    if(cb && typeof(cb) == 'function')
      cb(p_db);
  }
}
MongoPool.getInstance = getInstance;

module.exports = MongoPool;