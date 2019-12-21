'use strict';

const express = require('express');
const database = require('../database.js');
var router = express.Router();

router.get('/', async (req, res) => {
    try{
        let response=await database.getAllDocumentTypes();
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});


router.post('/', async (req, res) => {
    try{
        let response=await database.insertDocumentType(req.body);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

module.exports = router;