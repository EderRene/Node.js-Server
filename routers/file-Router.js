let express = require('express');
let router = express.Router();
const databaseMongo = require('../databaseMongo.js');
const multer = require('multer');
const {Readable} = require('stream');

router.post('/:idEmployee', async (req, res) => {
  const storage = multer.memoryStorage()
  const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});
  upload.single('files')(req, res, (err) => {
    databaseMongo.insertFile(req.files.file);
  });
});

module.exports = router;