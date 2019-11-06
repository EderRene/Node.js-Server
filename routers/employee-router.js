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
    database.insertEmployee()
        .then((res)=>{
            res.status(200).send(res);
        })
        .catch((err)=>{
            res.status(400);
        });
});

router.delete('/:id', (req, res) => {
    database.deleteEmployee(req.params['id'])
        .then((res)=>{
            res.status(200).send(res);
        })   
        .catch((err)=>{
            res.status(400).send(err);
        });
});

router.put('/:id', (req, res)=>{
    database.updateEmployee(req.params['id'])
        .then((res)=>{
            res.status(200).send(res);
        })
        .catch((err)=>{
            res.status(400).send(err);
        });
});

module.exports = router;