let express = require('express');
let router = express.Router();

router.post('/', async (req, res) => {
    try{
        res.status(201).send(req.files);
    } catch(error){
        res.status(500).send(error.message);
    }
});

module.exports = router;