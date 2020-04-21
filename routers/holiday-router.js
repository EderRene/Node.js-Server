'use strict';

const express = require('express');
const databaseMongo = require('../databaseMongo.js');
var router = express.Router();

module.exports = router;

router.get('/:id_Employee', async (req, res) => {
    try{
        let response=await databaseMongo.getHolidaysWithId(req.params['id_Employee']);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try{
        let response=await databaseMongo.insertHoliday(req.body);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});

router.put('/:id_Employee/:id_Holiday', async (req, res) => {
    try{
        let response=await databaseMongo.updateHolidayState(req.params['id_Employee'], req.params['id_Holiday'], req.body.state);
        res.status(response.statusCode).send(response.values);
    } catch(error){
        res.status(error.statusCode).send(error.message);
    }
});