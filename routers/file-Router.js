let express = require('express');
let router = express.Router();
const databaseMongo = require('../databaseMongo.js');
const multer = require('multer');
const {Readable} = require('stream');

router.get('/:id_Employee', async(req, res) => {
  try{
      let response=await databaseMongo.getFileDetails(req.params['id_Employee']);
      res.status(response.statusCode).send(response.values);
  } catch(error){
      res.status(error.statusCode).send(error.message);
  }
})

router.post('/:id_Employee', async (req, res) => {
  const storage = multer.memoryStorage()
  const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});
  for(let i=0; i<req.files.fileToUpload.length; i++){
    upload.single('files')(req, res, (err) => {
      databaseMongo.insertFile(req.files.fileToUpload[i], req.params['id_Employee']);
    });
  }
});

module.exports = router;