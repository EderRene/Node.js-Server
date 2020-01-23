'use strict';

const express = require('express');
const database = require('../databasePostgres.js');
var router = express.Router();

router.get('/', async (req, res) => {
    try{
        let response=await database.getAllCamps();
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.get('/:id', async(req, res) => {
    try{
        let response=await database.getCampWithId(req.params['id']);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
})

router.post('/', async (req, res) => {
    try{
        let response=await database.insertCamp(req.body);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.delete('/:id', async(req, res) => {
    try{
        let response=await database.deleteCamp(req.params['id']);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.put('/:id', async (req, res)=>{
    try{
        let response=await database.updateCamp(req.params['id'], req.body);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

module.exports = router;