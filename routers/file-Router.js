let express = require('express');
let router = express.Router();
const databaseMongo = require('../databaseMongo.js');
const multer = require('multer');
const {Readable} = require('stream');

router.get('/:id', async(req, res) => {
  try{
      let response=await database.getEmployeeWithId(req.params['id']);
      res.status(response.statusCode).send(response.values);
  } catch(error){
      res.status(error.statusCode).send(error.message);
  }
})

router.post('/:idEmployee', async (req, res) => {
  const storage = multer.memoryStorage()
  const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});
  upload.single('files')(req, res, (err) => {
    databaseMongo.insertFile(req.files.fileToUpload, req.params['idEmployee']);
  });
});

module.exports = router;