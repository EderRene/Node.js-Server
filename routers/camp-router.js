'use strict';

const express = require('express');
const database = require('../database.js');
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
        let result=await database.getCampWithId(req.params['id']);
        res.status(200).send(result);
    } catch(err){
        res.status(400).send(err);
    }
})

router.post('/', async (req, res) => {
    try{
        let result=await database.insertCamp(req.body);
        res.status(200).send(result);
    } catch(err){
        res.status(400).send(err);
    }
});

router.delete('/:id', async(req, res) => {
    try{
        let result=await database.deleteCamp(req.params['id']);
        res.status(200).send(result);
    } catch(err){
        res.status(400).send(err);
    }
});

router.put('/:id', async (req, res)=>{
    try{
        let result=await database.updateCamp(req.params['id'], req.body);
        res.status(200).send(result);
    } catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;