'use strict';

const express = require('express');
const databaseMongo = require('../databaseMongo.js');
var router = express.Router();

module.exports = router;

router.post('/', async (req, res) => {
    try{
        let response=await databaseMongo.insertWorkingHours(req.body);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});