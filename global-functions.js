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