'use strict';

const express = require('express');
const database = require('../database.js');
var router = express.Router();

router.get('/', async (req, res) => {
    try{
        let response=await database.getAllEmployees();
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.get('/:id', async(req, res) => {
    try{
        let response=await database.getEmployeeWithId(req.params['id']);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
})

router.post('/', async (req, res) => {
    try{
        let response=await database.insertEmployee(req.body);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.delete('/:id', async(req, res) => {
    try{
        let response=await database.deleteEmployee(req.params['id'], req.body.id_Camp);
        res.sendStatus(response.statusCode);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.put('/:id', async (req, res)=>{
    try{
        let response=await database.updateEmployee(req.params['id'], req.body);
        res.sendStatus(response.statusCode);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

module.exports = router;