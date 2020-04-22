let express = require('express');
let router = express.Router();
const databaseMongo = require('../databaseMongo.js');

router.get('/:id_Employee', async(req, res) => {
  try{
      let response=await databaseMongo.getFileDetails(req.params['id_Employee']);
      res.status(response.statusCode).send(response.values);
  } catch(error){
      res.status(error.statusCode).send(error.message);
  }
})

router.post('/:id_Employee', async (req, res) => {
  try{
    let response=await databaseMongo.insertFile(req.files.fileToUpload, req.params['id_Employee']);
    res.status(response.statusCode).send(response.values);
  } catch(error){
    res.status(error.statusCode).send(error.message);
  }
});

module.exports = router;