'use strict';

const express = require('express');
const databaseMongo = require('../databaseMongo.js');
var router = express.Router();

module.exports = router;

router.get('/:id', async (req, res) => {
    try{
        let response=await databaseMongo.getWorkingHoursWithIdAndSelectedDate(req.params['id'], req.body.startDate, req.body.endDate);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try{
        let response=await databaseMongo.insertWorkingHours(req.body);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.put('/:id/:wd', async (req, res) => {
    try{
        let response=await databaseMongo.updateWorkingHours(req.params['id'], req.params['wd'], req.body);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.put('/:id/', async (req, res) => {
    try{
        let response=await databaseMongo.updateWorkingHours(req.params['id'], req.body);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.delete('/:id', async (req, res) => {
    try{
        let response=await databaseMongo.deleteWorkingHours(req.params['id']);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});