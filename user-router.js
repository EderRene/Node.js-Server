'use strict';

const express = require('express');
const database = require('./database.js');
var router = express.Router();

router.get('/', (req, res) => {
    database.getAllUsers()
        .then((res)=>{
            res.status(200).send(res);
        })
        .catch((err)=>{
            res.status(400).send(err);
        })
});

router.get('/:id', (req, res) => {
    database.getUserWithId(req.params['id'])   
        .then((res)=>{
            res.status(200).send(res);
        })
        .catch((err)=>{
            res.status(400).send(err);
        });
})

router.post('/', (req, res) => {    
    database.insertUser()
        .then((res)=>{
            res.status(200).send(res);
        })
        .catch((err)=>{
            res.status(400);
        });
});

router.delete('/:id', (req, res) => {
    database.deleteUser(req.params['id'])
        .then((res)=>{
            res.status(200).send(res);
        })   
        .catch((err)=>{
            res.status(400).send(err);
        });
});

router.put('/:id', (req, res)=>{
    database.updateUser(req.params['id'])
        .then((res)=>{
            res.status(200).send(res);
        })
        .catch((err)=>{
            res.status(400).send(err);
        });
});

module.exports = router;