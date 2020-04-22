'use strict';

const express = require('express');
const database = require('../databasePostgres.js');
var router = express.Router();

router.get('/', async (req, res) => {
    try{
        let response=await database.getAllNews();
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try{
        let response=await database.insertNews(req.body);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.delete('/:id_News', async (req, res)=>{
    try{
        let response=await database.deleteNews(req.params['id_News']);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

module.exports = router;