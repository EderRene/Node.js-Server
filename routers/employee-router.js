'use strict';

const express = require('express');
const database = require('../database.js');
var router = express.Router();

router.get('/', async (req, res) => {
    try{
        let result=await database.getAllEmployees();
        res.status(200).send(result);
    } catch(err){
        res.status(400).send(err);
    }
});

router.get('/:id', async(req, res) => {
    try{
        let result=await database.getEmployeeWithId(req.params['id']);
        res.status(200).send(result);
    } catch(err){
        res.status(400).send(err);
    }
})

router.post('/', (req, res) => {
    try{
        let result=await database.insertEmployee(req.body);
        res.status(200).send(result);
    } catch(err){
        res.status(400).send(err);
    }
});

router.delete('/:id', (req, res) => {
    try{
        let result=await database.deleteEmployee(req.params['id']);
        res.status(200).send(result);
    } catch(err){
        res.status(400).send(err);
    }
});

router.put('/:id', (req, res)=>{
    try{
        let result=await database.updateEmployee(req.params['id'], req.body);
        res.status(200).send(result);
    } catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;