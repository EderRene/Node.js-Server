'use strict';

const express = require('express');
const WorkingHours = require('../models/workingHours-model.js');
var router = express.Router();

module.exports = router;

router.get('/:id', (req, res) => {
    WorkingHours.findOne({'mid': req.params['id']}, function (err, instruments) {
        if (err) {
            res.status(500).send('WorkingHours could not be found! ' + err.message);
        } else {
            res.status(200).send(instruments);
        }
    });
});

router.post('/', (req, res) => {
    var newWorkingHours = new WorkingHours(req.body);
    newWorkingHours.save(function (err, createdWorkingHours) {
        if (err) {
            res.status(500).send('WorkingHours could not be saved! ' + err.message);
        } else {
            res.status(201).send(createdWorkingHours);
        }
    });
}); 

router.delete('/:id', (req, res) => {
    WorkingHours.findOneAndDelete({ 'mid': req.params['id']}, function (err, docs) {
        if (err) {
            res.status(500).send('WorkingHours could not be deleted! ' + err.message);
        } else
            res.sendStatus(204);
    });
});