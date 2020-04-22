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

router.get('/:id_File/:filename', async(req, res) => {
  try{
    let response=await databaseMongo.getFileWithId(req.params['id_File'], req.params['filename']);
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

router.delete('/:id_File', async(req, res)=>{
  try{
    let response=await databaseMongo.deleteFileWithId(req.params['id_File']);
    res.status(response.statusCode).send(response.values);
  } catch(error){
    res.status(error.statusCode).send(error.message);
  }
});

module.exports = router;