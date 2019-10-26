'use strict';

const express = require('express');
const database = require('./database.js');
var router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send(database.getAllUsers());
});

router.post('/', (req, res) => {
    
});

router.delete('/:id', (req, res) => {
 
});

router.put('/:id', (req, res)=>{

});

module.exports = router;