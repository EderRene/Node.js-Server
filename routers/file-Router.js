let express = require('express');
let router = express.Router();

router.post('/', async (req, res) => {
    if(req.files){
        console.log(req.files);
    }
});

module.exports = router;